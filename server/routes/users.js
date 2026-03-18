const express = require("express");
const QRCode = require("qrcode");
const os = require("os");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const validator = require("validator");
const User = require("../models/User");
const PasswordResetOtp = require("../models/PasswordResetOtp");
const { sendOtpMail, sendFeedbackMail } = require("../utils/mail");
const { resetFirebasePasswordByEmail } = require("../utils/firebaseAdmin");

const router = express.Router();
const WRITE_RATE_LIMIT_MAX = 60;
const EDIT_TOKEN_EXPIRES_IN = "30d";
const OTP_DIGITS = 6;
const OTP_EXPIRES_MS = 10 * 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;

const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: WRITE_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many write requests. Please try again later.",
  },
});

const forgotPasswordRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many OTP requests. Please try again later.",
  },
});

const forgotPasswordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many reset attempts. Please try again later.",
  },
});

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many contact submissions. Please try again later.",
  },
});

const getJwtSecret = () =>
  process.env.JWT_SECRET || "dev-only-change-this-secret";

const normalizeEmail = (value = "") => String(value).trim().toLowerCase();

const generateOtp = () => {
  const min = 10 ** (OTP_DIGITS - 1);
  const max = 10 ** OTP_DIGITS;
  return String(Math.floor(Math.random() * (max - min)) + min);
};

const sanitizePayload = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizePayload(item));
  }

  if (value && typeof value === "object") {
    const output = {};
    for (const [key, val] of Object.entries(value)) {
      // Block Mongo operators and dotted keys to reduce NoSQL injection vectors.
      if (key.startsWith("$") || key.includes(".")) {
        continue;
      }

      output[key] = sanitizePayload(val);
    }
    return output;
  }

  if (typeof value === "string") {
    return value.trim();
  }

  return value;
};

const signEditToken = (uniqueId, editSecret) => {
  return jwt.sign(
    { uid: uniqueId, sec: editSecret, typ: "edit" },
    getJwtSecret(),
    { expiresIn: EDIT_TOKEN_EXPIRES_IN },
  );
};

const extractBearerToken = (authorization) => {
  if (!authorization || typeof authorization !== "string") return null;
  const [scheme, token] = authorization.split(" ");
  if (scheme !== "Bearer" || !token) return null;
  return token;
};

const getLocalIpv4Address = () => {
  const interfaces = os.networkInterfaces();

  for (const entries of Object.values(interfaces)) {
    for (const entry of entries || []) {
      if (entry.family === "IPv4" && !entry.internal) {
        return entry.address;
      }
    }
  }

  return "127.0.0.1";
};

const getFrontendBaseUrl = (req) => {
  if (process.env.FRONTEND_URL) {
    return process.env.FRONTEND_URL;
  }

  const configuredPort = process.env.FRONTEND_PORT || "5173";
  const localIp = getLocalIpv4Address();
  return `http://${localIp}:${configuredPort}`;
};

// @route   POST /api/users/create
// @desc    Create a new user and generate QR code
// @access  Public
router.post("/create", writeLimiter, async (req, res) => {
  try {
    const payload = sanitizePayload(req.body);

    const {
      ownerAuthUid,
      name,
      dateOfBirth,
      bloodGroup,
      gender,
      phone,
      alternatePhone,
      emergencyContact,
      disease,
      diseaseDetails,
      allergies,
      medications,
      address,
      notes,
    } = payload;

    const normalizedOwnerAuthUid =
      typeof ownerAuthUid === "string" && ownerAuthUid ? ownerAuthUid : null;

    if (!name || !bloodGroup || !phone || !emergencyContact?.phone) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["name", "bloodGroup", "phone", "emergencyContact.phone"],
      });
    }

    // Create new user
    const userData = {
      name,
      bloodGroup,
      phone,
      emergencyContact,
      disease: disease || false,
    };

    // Add optional fields if provided
    if (dateOfBirth) userData.dateOfBirth = dateOfBirth;
    if (gender) userData.gender = gender;
    if (alternatePhone) userData.alternatePhone = alternatePhone;
    if (diseaseDetails) userData.diseaseDetails = diseaseDetails;
    if (allergies) userData.allergies = allergies;
    if (medications) userData.medications = medications;
    if (address) userData.address = address;
    if (notes) userData.notes = notes;

    let user = null;

    if (normalizedOwnerAuthUid) {
      user = await User.findOne({
        ownerAuthUid: normalizedOwnerAuthUid,
        isActive: true,
      }).select("+editTokenHash");
    }

    const isExistingUser = !!user;

    if (!user) {
      if (normalizedOwnerAuthUid) {
        userData.ownerAuthUid = normalizedOwnerAuthUid;
      }
      user = new User(userData);
    } else {
      Object.assign(user, userData);
    }

    await user.save();

    const editSecret = crypto.randomBytes(24).toString("hex");
    user.editTokenHash = await bcrypt.hash(editSecret, 12);
    await user.save();
    const editToken = signEditToken(user.uniqueId, editSecret);

    // Generate QR code URL
    const frontendUrl = getFrontendBaseUrl(req);
    const profileUrl = `${frontendUrl}/emergency/${user.uniqueId}`;

    // Keep QR stable for the same user/profile; generate only when it does not exist.
    if (!user.qrCodeUrl) {
      user.qrCodeUrl = await QRCode.toDataURL(profileUrl, {
        errorCorrectionLevel: "M",
        type: "image/png",
        quality: 0.92,
        margin: 1,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
        width: 256,
      });
      await user.save();
    }

    res.status(201).json({
      success: true,
      message: isExistingUser
        ? "Emergency profile updated successfully"
        : "Emergency profile created successfully",
      data: {
        uniqueId: user.uniqueId,
        profileUrl,
        qrCode: user.qrCodeUrl,
        editToken,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message,
      );
      console.error("Validation errors:", validationErrors);
      return res.status(400).json({
        error: "Validation failed",
        details: validationErrors,
        fields: Object.keys(error.errors),
      });
    }

    if (error.code === 11000) {
      console.error("Duplicate key error:", error.keyPattern);
      return res.status(409).json({
        error: "Profile already exists",
        message: "A profile with this information already exists",
      });
    }

    console.error("Unexpected error:", error.message);
    res.status(500).json({
      error: "Failed to create emergency profile",
      message: "Please try again later",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// @route   GET /api/users/owner/:ownerAuthUid
// @desc    Get emergency profile by Firebase owner UID (mapping recovery)
// @access  Public
router.get("/owner/:ownerAuthUid", async (req, res) => {
  try {
    const ownerAuthUid = String(req.params.ownerAuthUid || "").trim();

    if (!ownerAuthUid) {
      return res.status(400).json({
        error: "ownerAuthUid is required",
      });
    }

    const user = await User.findOne({
      ownerAuthUid,
      isActive: true,
    });

    if (!user) {
      return res.status(404).json({
        error: "Emergency profile not found",
        message: "No active profile found for this account.",
      });
    }

    const emergencyData = user.getEmergencyData();

    return res.json({
      success: true,
      data: {
        ...emergencyData,
        lastUpdated: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error fetching user by owner UID:", error);
    return res.status(500).json({
      error: "Failed to fetch emergency profile",
      message: "Please try again later",
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get public emergency information by unique ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      uniqueId: id,
      isActive: true,
    });

    if (!user) {
      return res.status(404).json({
        error: "Emergency profile not found",
        message:
          "The requested emergency profile does not exist or has been deactivated",
      });
    }

    // Return only public emergency data
    const emergencyData = user.getEmergencyData();

    res.json({
      success: true,
      data: {
        ...emergencyData,
        lastUpdated: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      error: "Failed to fetch emergency profile",
      message: "Please try again later",
    });
  }
});

// @route   PUT /api/users/update/:id
// @desc    Update user emergency information
// @access  Public (but could be protected with authentication)
router.put("/update/:id", writeLimiter, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = sanitizePayload(req.body);
    const token = extractBearerToken(req.headers.authorization);
    const ownerAuthUid = String(updates.ownerAuthUid || "").trim();

    // Remove token requirement for initial fast failure if ownerAuthUid is provided
    if (!token && !ownerAuthUid) {
      return res.status(401).json({
        error: "Authorization required",
        message: "Missing or invalid bearer token or owner credential for profile edit.",
      });
    }

    const user = await User.findOne({
      uniqueId: id,
      isActive: true,
    }).select("+editTokenHash ownerAuthUid");

    if (!user) {
      return res.status(404).json({
        error: "Emergency profile not found",
        message: "The requested emergency profile does not exist or has been deactivated",
      });
    }

    let isAuthorized = false;

    // Check Token Auth
    if (token && user.editTokenHash) {
      try {
        const decoded = jwt.verify(token, getJwtSecret());
        if (decoded.typ === "edit" && decoded.uid === id && decoded.sec) {
          const tokenMatches = await bcrypt.compare(decoded.sec, user.editTokenHash);
          if (tokenMatches) isAuthorized = true;
        }
      } catch (error) {
        // Token verification failed, fallback to ownerAuthUid if provided
      }
    }

    // Fallback: Check Owner Auth UID
    if (!isAuthorized && ownerAuthUid) {
      if (user.ownerAuthUid === ownerAuthUid) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return res.status(403).json({
        error: "Forbidden",
        message: "Profile edit token is not valid or owner identity mismatch.",
      });
    }

    // List of fields that can be updated
    const allowedUpdates = [
      "name",
      "dateOfBirth",
      "bloodGroup",
      "gender",
      "phone",
      "alternatePhone",
      "emergencyContact",
      "disease",
      "diseaseDetails",
      "allergies",
      "medications",
      "address",
      "notes",
    ];

    // Filter out any fields that aren't allowed to be updated
    const validUpdates = {};
    allowedUpdates.forEach((field) => {
      if (updates[field] !== undefined) {
        validUpdates[field] = updates[field];
      }
    });

    // Apply updates
    Object.assign(user, validUpdates);
    await user.save();

    res.json({
      success: true,
      message: "Emergency profile updated successfully",
      data: {
        uniqueId: user.uniqueId,
        lastUpdated: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message,
      );
      return res.status(400).json({
        error: "Validation failed",
        details: validationErrors,
      });
    }

    res.status(500).json({
      error: "Failed to update emergency profile",
      message: "Please try again later",
    });
  }
});

// @route   POST /api/users/auth/forgot-password/request
// @desc    Send OTP to email for password reset
// @access  Public
router.post(
  "/auth/forgot-password/request",
  forgotPasswordRequestLimiter,
  async (req, res) => {
    try {
      const email = normalizeEmail(req.body?.email);

      if (!validator.isEmail(email)) {
        return res.status(400).json({
          error: "Valid email is required",
        });
      }

      const otp = generateOtp();
      const otpHash = await bcrypt.hash(otp, 10);
      const expiresAt = new Date(Date.now() + OTP_EXPIRES_MS);

      await PasswordResetOtp.findOneAndUpdate(
        { email },
        {
          email,
          otpHash,
          expiresAt,
          attempts: 0,
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        },
      );

      await sendOtpMail({ otp, email });

      return res.json({
        success: true,
        message: "OTP has been sent to your email.",
      });
    } catch (error) {
      console.error("Error sending password reset OTP:", error);
      return res.status(500).json({
        error: "Failed to send OTP email",
        message: "Please try again later.",
      });
    }
  },
);

// @route   POST /api/users/auth/forgot-password/reset
// @desc    Verify OTP and reset Firebase password
// @access  Public
router.post(
  "/auth/forgot-password/verify",
  forgotPasswordResetLimiter,
  async (req, res) => {
    try {
      const email = normalizeEmail(req.body?.email);
      const otp = String(req.body?.otp || "").trim();

      if (!validator.isEmail(email)) {
        return res.status(400).json({
          error: "Valid email is required",
        });
      }

      if (!/^\d{6}$/.test(otp)) {
        return res.status(400).json({
          error: "Invalid OTP format",
          message: "OTP must be a 6-digit number.",
        });
      }

      const otpRecord = await PasswordResetOtp.findOne({ email });
      if (!otpRecord) {
        return res.status(400).json({
          error: "OTP expired or not found",
        });
      }

      if (otpRecord.expiresAt.getTime() < Date.now()) {
        await PasswordResetOtp.deleteOne({ email });
        return res.status(400).json({
          error: "OTP expired",
          message: "Please request a new OTP.",
        });
      }

      if (otpRecord.attempts >= OTP_MAX_ATTEMPTS) {
        await PasswordResetOtp.deleteOne({ email });
        return res.status(429).json({
          error: "Too many invalid OTP attempts",
          message: "Please request a new OTP.",
        });
      }

      const otpMatches = await bcrypt.compare(otp, otpRecord.otpHash);
      if (!otpMatches) {
        otpRecord.attempts += 1;
        await otpRecord.save();
        return res.status(400).json({
          error: "Invalid OTP",
          message: "OTP does not match.",
        });
      }

      return res.json({
        success: true,
        message: "OTP verified successfully.",
      });
    } catch (error) {
      console.error("Error verifying password reset OTP:", error);
      return res.status(500).json({
        error: "Failed to verify OTP",
        message: "Please try again later.",
      });
    }
  },
);

router.post(
  "/auth/forgot-password/reset",
  forgotPasswordResetLimiter,
  async (req, res) => {
    try {
      const email = normalizeEmail(req.body?.email);
      const otp = String(req.body?.otp || "").trim();
      const newPassword = String(req.body?.newPassword || "");

      if (!validator.isEmail(email)) {
        return res.status(400).json({
          error: "Valid email is required",
        });
      }

      if (!/^\d{6}$/.test(otp)) {
        return res.status(400).json({
          error: "Invalid OTP format",
          message: "OTP must be a 6-digit number.",
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          error: "Invalid password",
          message: "Password must be at least 6 characters long.",
        });
      }

      const otpRecord = await PasswordResetOtp.findOne({ email });
      if (!otpRecord) {
        return res.status(400).json({
          error: "OTP expired or not found",
        });
      }

      if (otpRecord.expiresAt.getTime() < Date.now()) {
        await PasswordResetOtp.deleteOne({ email });
        return res.status(400).json({
          error: "OTP expired",
          message: "Please request a new OTP.",
        });
      }

      if (otpRecord.attempts >= OTP_MAX_ATTEMPTS) {
        await PasswordResetOtp.deleteOne({ email });
        return res.status(429).json({
          error: "Too many invalid OTP attempts",
          message: "Please request a new OTP.",
        });
      }

      const otpMatches = await bcrypt.compare(otp, otpRecord.otpHash);
      if (!otpMatches) {
        otpRecord.attempts += 1;
        await otpRecord.save();
        return res.status(400).json({
          error: "Invalid OTP",
          message: "OTP does not match.",
        });
      }

      await resetFirebasePasswordByEmail(email, newPassword);
      await PasswordResetOtp.deleteOne({ email });

      return res.json({
        success: true,
        message: "Password reset successful.",
      });
    } catch (error) {
      console.error("Error resetting password with OTP:", error);

      if (error?.code === "firebase-admin/not-configured") {
        return res.status(503).json({
          error: "Password reset unavailable",
          message:
            "Server is missing Firebase Admin credentials. Configure FIREBASE_SERVICE_ACCOUNT_JSON and restart backend.",
        });
      }

      if (error?.code === "firebase-admin/invalid-config") {
        return res.status(500).json({
          error: "Password reset unavailable",
          message:
            "Server Firebase Admin config is invalid. Fix FIREBASE_SERVICE_ACCOUNT_JSON format and restart backend.",
        });
      }

      if (error?.code === "auth/user-not-found") {
        return res.status(404).json({
          error: "Account not found",
          message: "No account exists with this email.",
        });
      }

      if (error?.code === "auth/invalid-password") {
        return res.status(400).json({
          error: "Invalid password",
          message: "Password does not meet Firebase requirements.",
        });
      }

      return res.status(500).json({
        error: "Failed to reset password",
        message: "Please try again later.",
      });
    }
  },
);

// @route   POST /api/users/contact
// @desc    Send user feedback/contact message to support email via Brevo
// @access  Public (client restricts this to logged-in users)
router.post("/contact", contactLimiter, async (req, res) => {
  try {
    const payload = sanitizePayload(req.body || {});
    const category = String(payload.category || "")
      .trim()
      .toLowerCase();
    const rawSubject = String(payload.subject || "").trim();
    const subjectByCategory = {
      appreciation: "Appreciation from app user",
      suggestion: "Suggestion from app user",
      bug: "Bug report from app user",
    };
    const subject =
      rawSubject.length >= 3
        ? rawSubject
        : subjectByCategory[category] || "Feedback from app user";
    const message = String(payload.message || "").trim();
    const userName = String(payload.userName || "").trim();
    const userEmail = normalizeEmail(payload.userEmail || "");
    const ownerAuthUid = String(payload.ownerAuthUid || "").trim();

    const allowedCategories = ["bug", "suggestion", "appreciation"];

    if (!allowedCategories.includes(category)) {
      return res.status(400).json({
        error: "Invalid category",
        message: "Category must be bug, suggestion, or appreciation.",
      });
    }

    if (subject.length > 140) {
      return res.status(400).json({
        error: "Invalid subject",
        message: "Subject must be at most 140 characters.",
      });
    }

    if (!message || message.length < 10 || message.length > 3000) {
      return res.status(400).json({
        error: "Invalid message",
        message: "Message must be between 10 and 3000 characters.",
      });
    }

    if (!ownerAuthUid) {
      return res.status(400).json({
        error: "ownerAuthUid is required",
      });
    }

    if (userEmail && !validator.isEmail(userEmail)) {
      return res.status(400).json({
        error: "Invalid user email",
      });
    }

    await sendFeedbackMail({
      category,
      subject,
      message,
      userName,
      userEmail,
      ownerAuthUid,
    });

    return res.json({
      success: true,
      message: "Feedback sent successfully.",
    });
  } catch (error) {
    console.error("Error sending feedback message:", error);
    return res.status(500).json({
      error: "Failed to send feedback",
      message: "Please try again later.",
    });
  }
});

// @route   GET /api/users
// @desc    Get all users (for admin purposes - remove in production)
// @access  Public (should be protected in production)
router.get("/", async (req, res) => {
  try {
    if (process.env.NODE_ENV === "production") {
      return res.status(403).json({
        error: "Forbidden",
        message: "Listing all users is disabled in production.",
      });
    }

    const users = await User.find({ isActive: true })
      .select("name phone bloodGroup createdAt uniqueId")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      error: "Failed to fetch users",
      message: "Please try again later",
    });
  }
});

module.exports = router;
