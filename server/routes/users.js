const express = require("express");
const QRCode = require("qrcode");
const os = require("os");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const User = require("../models/User");

const router = express.Router();
const WRITE_RATE_LIMIT_MAX = 60;
const EDIT_TOKEN_EXPIRES_IN = "30d";

const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: WRITE_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many write requests. Please try again later.",
  },
});

const getJwtSecret = () =>
  process.env.JWT_SECRET || "dev-only-change-this-secret";

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

    const user = new User(userData);
    await user.save();

    const editSecret = crypto.randomBytes(24).toString("hex");
    user.editTokenHash = await bcrypt.hash(editSecret, 12);
    await user.save();
    const editToken = signEditToken(user.uniqueId, editSecret);

    // Generate QR code URL
    const frontendUrl = getFrontendBaseUrl(req);
    const profileUrl = `${frontendUrl}/emergency/${user.uniqueId}`;

    // Generate QR code as base64 image
    const qrCodeDataUrl = await QRCode.toDataURL(profileUrl, {
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

    // Update user with QR code URL
    user.qrCodeUrl = qrCodeDataUrl;
    await user.save();

    res.status(201).json({
      success: true,
      message: "Emergency profile created successfully",
      data: {
        uniqueId: user.uniqueId,
        profileUrl,
        qrCode: qrCodeDataUrl,
        editToken,
        createdAt: user.createdAt,
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

    if (!token) {
      return res.status(401).json({
        error: "Authorization required",
        message: "Missing or invalid bearer token for profile edit.",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, getJwtSecret());
    } catch (error) {
      return res.status(401).json({
        error: "Invalid token",
        message: "Edit session has expired or is invalid.",
      });
    }

    if (decoded.typ !== "edit" || decoded.uid !== id || !decoded.sec) {
      return res.status(403).json({
        error: "Forbidden",
        message: "Token does not match this profile.",
      });
    }

    const user = await User.findOne({
      uniqueId: id,
      isActive: true,
    }).select("+editTokenHash");

    if (!user) {
      return res.status(404).json({
        error: "Emergency profile not found",
        message:
          "The requested emergency profile does not exist or has been deactivated",
      });
    }

    const tokenMatches = user.editTokenHash
      ? await bcrypt.compare(decoded.sec, user.editTokenHash)
      : false;

    if (!tokenMatches) {
      return res.status(403).json({
        error: "Forbidden",
        message: "Profile edit token is not valid for this record.",
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
