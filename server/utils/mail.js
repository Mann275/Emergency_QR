const ensureMailConfig = () => {
  const apiKey = process.env.BREVO_API_KEY || process.env.BRAVO_API_KEY;
  if (!apiKey || !process.env.MAIL_USER) {
    throw new Error(
      "Email configuration is missing. Set BREVO_API_KEY (or BRAVO_API_KEY) and MAIL_USER in server .env",
    );
  }
};

const ensureFetch = () => {
  if (typeof fetch !== "function") {
    throw new Error("Global fetch is unavailable. Use Node.js 18+.");
  }
};

const senderName = "Emergency QR";
const supportName = "Mann Patel";

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");

const sendOtpMail = async ({ otp, email }) => {
  ensureFetch();
  ensureMailConfig();
  const apiKey = process.env.BREVO_API_KEY || process.env.BRAVO_API_KEY;

  const safeOtp = escapeHtml(otp);
  const safeEmail = String(email || "")
    .trim()
    .toLowerCase();

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: senderName, email: process.env.MAIL_USER },
      to: [{ email: safeEmail }],
      subject: "Password Reset OTP Verification",
      htmlContent: `<p>Dear User,</p>
      <p>We received a request to reset your password. Please use the following One-Time Password (OTP) to proceed with resetting your password:</p>
      <h2><b>${safeOtp}</b></h2>
      <p>This OTP is valid for the next 10 minutes. If you did not request a password reset, please ignore this email.</p>
      <p>Best regards,<br>${escapeHtml(supportName)}</p>`,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Brevo email send failed: ${errorBody}`);
  }

  const data = await response.json();
  return data?.messageId || null;
};

const sendFeedbackMail = async ({
  category,
  subject,
  message,
  userName,
  userEmail,
  ownerAuthUid,
}) => {
  ensureFetch();
  ensureMailConfig();

  const apiKey = process.env.BREVO_API_KEY || process.env.BRAVO_API_KEY;
  const recipientEmail =
    process.env.FEEDBACK_RECEIVER_EMAIL ||
    process.env.SUPPORT_RECEIVER_EMAIL ||
    process.env.MAIL_USER;

  const safeCategory = escapeHtml(category || "general");
  const safeSubject = escapeHtml(subject || "No Subject");
  const safeMessage = escapeHtml(message || "").replace(/\n/g, "<br/>");
  const safeUserName = escapeHtml(userName || "N/A");
  const safeUserEmail = escapeHtml(userEmail || "N/A");
  const safeOwnerAuthUid = escapeHtml(ownerAuthUid || "N/A");

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: senderName, email: process.env.MAIL_USER },
      to: [{ email: recipientEmail }],
      replyTo: userEmail
        ? {
            email: String(userEmail).trim().toLowerCase(),
            name: userName || "App User",
          }
        : undefined,
      subject: `[Emergency QR][${String(category || "GENERAL").toUpperCase()}] ${subject}`,
      htmlContent: `<h3>New User Feedback</h3>
      <p><b>Category:</b> ${safeCategory}</p>
      <p><b>Subject:</b> ${safeSubject}</p>
      <p><b>User Name:</b> ${safeUserName}</p>
      <p><b>User Email:</b> ${safeUserEmail}</p>
      <p><b>User UID:</b> ${safeOwnerAuthUid}</p>
      <hr />
      <p><b>Message:</b></p>
      <p>${safeMessage}</p>`,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Brevo feedback email send failed: ${errorBody}`);
  }

  const data = await response.json();
  return data?.messageId || null;
};

module.exports = {
  sendOtpMail,
  sendFeedbackMail,
};
