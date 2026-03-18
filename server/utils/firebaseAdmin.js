const admin = require("firebase-admin");

let initialized = false;

const parseServiceAccount = () => {
  const rawConfig = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!rawConfig) {
    const error = new Error(
      "Firebase Admin is not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON in server .env",
    );
    error.code = "firebase-admin/not-configured";
    throw error;
  }

  try {
    return JSON.parse(rawConfig);
  } catch (parseError) {
    const error = new Error(
      "FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON. Store it as a single-line JSON string in server .env.",
    );
    error.code = "firebase-admin/invalid-config";
    throw error;
  }
};

const getAuth = () => {
  if (!initialized) {
    const serviceAccount = parseServiceAccount();

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    initialized = true;
  }

  return admin.auth();
};

const resetFirebasePasswordByEmail = async (email, newPassword) => {
  const auth = getAuth();
  const user = await auth.getUserByEmail(email);
  await auth.updateUser(user.uid, { password: newPassword });
  return user.uid;
};

module.exports = {
  resetFirebasePasswordByEmail,
};
