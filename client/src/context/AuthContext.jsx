import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext(null);
const USER_PROFILE_KEY_PREFIX = "emergency_user_profile:";
const EDIT_TOKEN_KEY_PREFIX = "emergency_edit_token:";

const clearLocalSessionState = () => {
  const keysToRemove = [];
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (!key) continue;

    if (
      key.startsWith(USER_PROFILE_KEY_PREFIX) ||
      key.startsWith(EDIT_TOKEN_KEY_PREFIX)
    ) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => localStorage.removeItem(key));
};

const mapFirebaseAuthError = (error) => {
  const code = error?.code || "";

  switch (code) {
    case "auth/operation-not-allowed":
      return "Email/Password sign-in is disabled in Firebase. Enable it in Authentication > Sign-in method.";
    case "auth/unauthorized-domain":
      return "This domain is not authorized in Firebase. Add localhost in Authentication > Settings > Authorized domains.";
    case "auth/email-already-in-use":
      return "This email is already in use. Try signing in instead.";
    case "auth/invalid-email":
      return "Invalid email format.";
    case "auth/weak-password":
      return "Password is too weak. Use at least 6 characters.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait and try again.";
    case "auth/popup-closed-by-user":
      return "Google sign-in popup was closed before completing sign-in.";
    case "auth/popup-blocked":
      return "Popup was blocked by browser. Allow popups and try again.";
    default:
      return error?.message || "Authentication failed.";
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        clearLocalSessionState();
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        // Force-refresh auth state so deleted/disabled users do not stay cached.
        await currentUser.reload();
        setUser(auth.currentUser);
      } catch (error) {
        clearLocalSessionState();
        try {
          await signOut(auth);
        } catch {
          // Ignore signOut failures while clearing stale UI session.
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (!methods.length) {
        throw new Error(
          "No account found for this email. Please sign up first.",
        );
      }
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw new Error(mapFirebaseAuthError(error));
    }
  };

  const signUp = async (email, password) => {
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length) {
        throw new Error(
          "This email is already in use. Try signing in instead.",
        );
      }
      return await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw new Error(mapFirebaseAuthError(error));
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      return await signInWithPopup(auth, provider);
    } catch (error) {
      throw new Error(mapFirebaseAuthError(error));
    }
  };

  const logout = async () => {
    clearLocalSessionState();
    return signOut(auth);
  };

  const value = useMemo(
    () => ({ user, loading, signIn, signUp, signInWithGoogle, logout }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
