const admin = require("firebase-admin");

let initialized = false;

const getAuth = () => {
  if (!initialized) {
    const rawConfig = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    const serviceAccount = rawConfig ? JSON.parse(rawConfig) : null;

    if (!serviceAccount) {
      throw new Error(
        "Firebase Admin is not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON in server .env",
      );
    }

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
