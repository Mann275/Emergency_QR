import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext(null);

const clearLocalSessionState = () => {
  // Intentionally left blank.
  // Keep local profile/edit linkage on logout so users can re-login and continue
  // editing their own profile from the same browser.
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
    case "auth/network-request-failed":
      return "Network error while contacting Firebase. Check your internet and try again.";
    case "auth/invalid-api-key":
      return "Firebase API key is invalid. Check your VITE_FIREBASE_API_KEY in environment config.";
    default:
      return error?.message || "Authentication failed.";
  }
};

const buildMappedAuthError = (error) => {
  const mappedError = new Error(mapFirebaseAuthError(error));
  mappedError.code = error?.code || "auth/unknown";
  mappedError.originalMessage = error?.message || "";
  return mappedError;
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
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw buildMappedAuthError(error);
    }
  };

  const signUp = async (email, password) => {
    try {
      return await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw buildMappedAuthError(error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      return await signInWithPopup(auth, provider);
    } catch (error) {
      throw buildMappedAuthError(error);
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
