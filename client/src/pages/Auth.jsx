import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { showToast } from "../utils/toast.jsx";
import ApiService from "../utils/api";

const Auth = () => {
  const { t } = useLanguage();
  const { user, loading, signIn, signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = useMemo(() => {
    if (location.state?.redirectTo) return location.state.redirectTo;
    if (user?.uid) {
      const storedId = localStorage.getItem(
        `emergency_user_profile:${user.uid}`,
      );
      if (storedId) return `/success/${storedId}`;
    }
    return "/create";
  }, [location.state, user?.uid]);

  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [confirmResetPassword, setConfirmResetPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [resetSubmitting, setResetSubmitting] = useState(false);
  const [resetError, setResetError] = useState("");
  const forgotPasswordLabel =
    (typeof t.authForgotPassword === "string"
      ? t.authForgotPassword.trim()
      : "") || "Forgot password?";

  useEffect(() => {
    if (loading) return;
    if (user) {
      navigate(redirectTo, { replace: true });
    }
  }, [loading, user, navigate, redirectTo]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      setAuthError(
        t.emailPasswordRequired || "Email and password are required.",
      );
      return;
    }
    setAuthError("");

    try {
      setSubmitting(true);
      if (mode === "signup") {
        await signUp(email, password);
        showToast({
          message: t.authAccountCreated || "Account created successfully :)",
        });
      } else {
        await signIn(email, password);
        showToast({ message: t.authSignedIn || "Signed in successfully :)" });
      }
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setAuthError(error.message || t.authFailed || "Authentication failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setAuthError("");
      await signInWithGoogle();
      showToast({
        message: t.authGoogleSignedIn || "Signed in with Google",
      });
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setAuthError(
        error.message || t.googleAuthFailed || "Google sign-in failed.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const openForgotModal = () => {
    setShowForgotModal(true);
    setResetEmail(email || "");
    setResetOtp("");
    setResetPassword("");
    setConfirmResetPassword("");
    setOtpSent(false);
    setAuthError("");
    setResetError("");
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setResetOtp("");
    setResetPassword("");
    setConfirmResetPassword("");
    setOtpSent(false);
    setResetError("");
  };

  const handleRequestOtp = async () => {
    const normalizedEmail = resetEmail.trim();
    if (!normalizedEmail) {
      setResetError("Please enter your account email for OTP.");
      return;
    }

    try {
      setResetError("");
      setResetSubmitting(true);
      await ApiService.requestPasswordResetOtp(normalizedEmail);
      setOtpSent(true);
      showToast({
        message: "OTP sent. Please check your email inbox.",
      });
    } catch (error) {
      setResetError(error.message || "Failed to send OTP.");
    } finally {
      setResetSubmitting(false);
    }
  };

  const handleResetWithOtp = async (event) => {
    event.preventDefault();
    const normalizedEmail = resetEmail.trim();

    if (!normalizedEmail || !resetOtp || !resetPassword) {
      setResetError("Email, OTP, and new password are required.");
      return;
    }

    if (resetPassword.length < 6) {
      setResetError("New password must be at least 6 characters.");
      return;
    }

    if (resetPassword !== confirmResetPassword) {
      setResetError("Passwords do not match.");
      return;
    }

    try {
      setResetError("");
      setResetSubmitting(true);
      await ApiService.resetPasswordWithOtp({
        email: normalizedEmail,
        otp: resetOtp,
        newPassword: resetPassword,
      });

      showToast({
        message: "Password changed successfully. Please sign in.",
      });
      setMode("signin");
      setPassword("");
      closeForgotModal();
    } catch (error) {
      setResetError(error.message || "Failed to reset password.");
    } finally {
      setResetSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass-card p-6 sm:p-8 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
          <p className="mt-3 text-sm font-semibold text-[var(--muted)]">
            {t.authChecking || "Checking authentication..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 sm:pb-32">
      <section className="pt-24 sm:pt-28">
        <div className="main-wrap max-w-md px-4">
          <div className="mb-5 text-center px-2">
            <h1
              className="text-2xl sm:text-4xl font-bold text-[var(--ink)]"
              style={{ fontFamily: "var(--font-heading)" }}
              data-t={mode === "signup" ? "authTitleSignUp" : "authTitleSignIn"}
            >
              {mode === "signup"
                ? t.authTitleSignUp || "Create your account"
                : t.authTitleSignIn || "Welcome back"}
            </h1>
            <p
              className="mt-1 text-sm text-[var(--muted)]"
              data-t={
                mode === "signup" ? "authSubtitleSignUp" : "authSubtitleSignIn"
              }
            >
              {mode === "signup"
                ? t.authSubtitleSignUp || "Sign up to save your profile."
                : t.authSubtitleSignIn || "Sign in to finish your profile."}
            </p>
            <Link
              to="/preview"
              className="mt-2.5 inline-flex items-center text-xs font-semibold text-[var(--accent)]"
              data-t="authPreviewLink"
            >
              {t.authPreviewLink || "Preview a sample profile first"}
            </Link>
          </div>

          <div className="glass-card border-[rgba(35,19,26,0.25)] p-5 sm:p-8">
            {authError && (
              <div className="mb-4 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50/50 p-4 text-sm font-semibold text-red-600 animate-slide-up">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100">
                  <span className="mb-0.5">!</span>
                </span>
                {authError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 grid gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-semibold text-[var(--muted)] flex items-center gap-2">
                  <Mail size={14} />{" "}
                  <span data-t="authEmailLabel">
                    {t.authEmailLabel || "Email"}
                  </span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    mode === "signup"
                      ? t.authEmailPlaceholderSignUp ||
                        "Enter a new email address"
                      : t.authEmailPlaceholderSignIn ||
                        "Enter your account email"
                  }
                  required
                  className="w-full rounded-xl border border-[var(--line)] bg-white/55 px-4 py-2.5 text-[15px] font-medium text-[var(--ink)] outline-none backdrop-blur-xl"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-semibold text-[var(--muted)] flex items-center gap-2">
                  <Lock size={14} />{" "}
                  <span data-t="authPasswordLabel">
                    {t.authPasswordLabel || "Password"}
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={
                      mode === "signup"
                        ? t.authPasswordPlaceholderSignUp ||
                          "Create password (min 6 characters)"
                        : t.authPasswordPlaceholderSignIn ||
                          "Enter your password"
                    }
                    minLength={6}
                    required
                    className="w-full rounded-xl border border-[var(--line)] bg-white/55 px-4 py-2.5 pr-12 text-[15px] font-medium text-[var(--ink)] outline-none backdrop-blur-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] transition hover:text-[var(--ink)]"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="-mt-1 flex justify-end">
                <button
                  type="button"
                  onClick={openForgotModal}
                  className="rounded-md px-1 py-1 text-xs font-bold tracking-[0.01em] text-[var(--accent)] underline underline-offset-2"
                  data-t="authForgotPassword"
                >
                  {forgotPasswordLabel}
                </button>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="stark-btn gap-2 justify-center disabled:cursor-not-allowed disabled:opacity-70"
                data-t={
                  submitting
                    ? "authPleaseWait"
                    : mode === "signup"
                      ? "authCreateAccount"
                      : "authSignIn"
                }
              >
                {submitting
                  ? t.authPleaseWait || "Please wait"
                  : mode === "signup"
                    ? t.authCreateAccount || "Create account"
                    : t.authSignIn || "Sign in"}
              </button>

              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                <span className="h-px flex-1 bg-[var(--line)]" />
                <span data-t="authOr">{t.authOr || "OR"}</span>
                <span className="h-px flex-1 bg-[var(--line)]" />
              </div>

              <button
                type="button"
                onClick={handleGoogle}
                disabled={submitting}
                className="flex w-fit mx-auto items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-white/60 px-4 py-2.5 text-sm font-semibold text-[var(--ink)] transition hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span className="flex h-5 w-5 items-center justify-center">
                  <svg viewBox="0 0 48 48" className="h-5 w-5">
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.4 0 6.5 1.2 8.9 3.2l6.6-6.6C35.7 2.4 30.2 0 24 0 14.6 0 6.4 5.4 2.6 13.2l7.8 6.1C12.1 13.2 17.6 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.5 24.5c0-1.6-.1-2.8-.4-4.1H24v7.8h12.7c-.6 3-2.3 5.5-4.9 7.2l7.6 5.8c4.5-4.2 7.1-10.4 7.1-16.7z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.4 28.7c-1-3-1-6.4 0-9.4l-7.8-6.1C-.7 18.7-.7 29.3 2.6 35.8l7.8-7.1z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.2 0 11.4-2.1 15.2-5.7l-7.6-5.8c-2.1 1.4-4.8 2.2-7.6 2.2-6.4 0-11.9-3.7-14.6-9l-7.8 7.1C6.4 42.6 14.6 48 24 48z"
                    />
                  </svg>
                </span>
                {t.authContinueGoogle || "Continue with Google"}
              </button>

              <div className="text-center text-sm text-[var(--muted)]">
                <span
                  data-t={
                    mode === "signup" ? "authHaveAccount" : "authNeedAccount"
                  }
                >
                  {mode === "signup"
                    ? t.authHaveAccount || "Already have an account?"
                    : t.authNeedAccount || "New here?"}
                </span>{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode((prev) =>
                      prev === "signup" ? "signin" : "signup",
                    );
                    setAuthError("");
                  }}
                  className="font-semibold text-[var(--accent)]"
                  data-t={mode === "signup" ? "authSignIn" : "authSignUp"}
                >
                  {mode === "signup"
                    ? t.authSignIn || "Sign in"
                    : t.authSignUp || "Sign up"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {showForgotModal && (
        <div
          className="fixed inset-0 z-[220] flex items-center justify-center bg-black/35 px-4"
          onClick={closeForgotModal}
        >
          <div
            className="glass-card w-full max-w-md p-5 sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <h2
              className="text-xl sm:text-2xl font-bold text-[var(--ink)]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {t.authForgotPassword || "Forgot password"}
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {t.authForgotPasswordCopy ||
                "Enter your email, verify OTP, and set a new password."}
            </p>

            {resetError && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50/60 px-3 py-2 text-sm font-semibold text-red-700">
                {resetError}
              </div>
            )}

            <div className="mt-5 grid gap-2">
              <label className="text-sm font-semibold text-[var(--muted)]">
                {t.authEmailLabel || "Email"}
              </label>
              <input
                type="email"
                value={resetEmail}
                onChange={(event) => setResetEmail(event.target.value)}
                placeholder="Enter your account email"
                className="w-full rounded-xl border border-[var(--line)] bg-white/55 px-4 py-2.5 text-[15px] font-medium text-[var(--ink)] outline-none backdrop-blur-xl"
              />
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={handleRequestOtp}
                disabled={resetSubmitting}
                className="stark-btn w-full justify-center disabled:cursor-not-allowed disabled:opacity-70"
              >
                {resetSubmitting
                  ? "Sending..."
                  : otpSent
                    ? "Resend OTP"
                    : "Send OTP"}
              </button>
            </div>

            {otpSent && (
              <form onSubmit={handleResetWithOtp} className="mt-4 grid gap-3">
                <div className="grid gap-2">
                  <label className="text-sm font-semibold text-[var(--muted)]">
                    OTP
                  </label>
                  <input
                    type="text"
                    value={resetOtp}
                    onChange={(event) =>
                      setResetOtp(
                        event.target.value.replace(/\D/g, "").slice(0, 6),
                      )
                    }
                    placeholder="Enter 6-digit OTP"
                    className="w-full rounded-xl border border-[var(--line)] bg-white/55 px-4 py-2.5 text-[15px] font-medium text-[var(--ink)] outline-none backdrop-blur-xl"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-semibold text-[var(--muted)]">
                    New password
                  </label>
                  <input
                    type="password"
                    value={resetPassword}
                    onChange={(event) => setResetPassword(event.target.value)}
                    placeholder="Minimum 6 characters"
                    minLength={6}
                    className="w-full rounded-xl border border-[var(--line)] bg-white/55 px-4 py-2.5 text-[15px] font-medium text-[var(--ink)] outline-none backdrop-blur-xl"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-semibold text-[var(--muted)]">
                    Confirm password
                  </label>
                  <input
                    type="password"
                    value={confirmResetPassword}
                    onChange={(event) =>
                      setConfirmResetPassword(event.target.value)
                    }
                    placeholder="Re-enter new password"
                    minLength={6}
                    className="w-full rounded-xl border border-[var(--line)] bg-white/55 px-4 py-2.5 text-[15px] font-medium text-[var(--ink)] outline-none backdrop-blur-xl"
                  />
                </div>

                <button
                  type="submit"
                  disabled={resetSubmitting}
                  className="stark-btn w-full justify-center disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {resetSubmitting ? "Resetting..." : "Reset password"}
                </button>
              </form>
            )}

            <div className="mt-4">
              <button
                type="button"
                onClick={closeForgotModal}
                className="ghost-btn w-full justify-center"
              >
                {t.cancelEdit || "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;
