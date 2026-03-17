import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { toast } from "react-hot-toast";
import { showToast } from "../utils/toast.jsx";

const Auth = () => {
  const { t } = useLanguage();
  const { user, loading, signIn, signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = useMemo(
    () => location.state?.redirectTo || "/create",
    [location.state],
  );

  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (user) {
      navigate(redirectTo, { replace: true });
    }
  }, [loading, user, navigate, redirectTo]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      toast.error(t.emailPasswordRequired || "Email and password are required.");
      return;
    }

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
      toast.error(error.message || t.authFailed || "Authentication failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setSubmitting(true);
      await signInWithGoogle();
      showToast({
        message: t.authGoogleSignedIn || "Signed in with Google :)",
      });
      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast.error(
        error.message || t.googleAuthFailed || "Google sign-in failed.",
      );
    } finally {
      setSubmitting(false);
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
    <div className="pb-16 sm:pb-24">
      <section className="pt-20 sm:pt-28">
        <div className="main-wrap max-w-lg">
          <div className="mb-6 text-center">
            <h1
              className="text-3xl sm:text-4xl font-bold text-[var(--ink)]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {mode === "signup"
                ? t.authTitleSignUp || "Create your account"
                : t.authTitleSignIn || "Welcome back"}
            </h1>
            <p className="mt-2 text-base text-[var(--muted)]">
              {mode === "signup"
                ? t.authSubtitleSignUp ||
                  "Sign up to save your emergency profile securely."
                : t.authSubtitleSignIn ||
                  "Sign in to finish your emergency profile."}
            </p>
            <Link
              to="/preview"
              className="mt-3 inline-flex items-center text-sm font-semibold text-[var(--accent)]"
            >
              {t.authPreviewLink || "Preview a sample profile first"}
            </Link>
          </div>

          <div className="glass-card border-[rgba(35,19,26,0.25)] p-6 sm:p-8">

            <form onSubmit={handleSubmit} className="mt-6 grid gap-5">
              <div className="grid gap-2">
                <label className="text-sm font-semibold text-[var(--muted)] flex items-center gap-2">
                  <Mail size={14} /> {t.authEmailLabel || "Email"}
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
                  className="w-full rounded-2xl border border-[var(--line)] bg-white/55 px-4 py-3 text-base font-medium text-[var(--ink)] outline-none backdrop-blur-xl"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-semibold text-[var(--muted)] flex items-center gap-2">
                  <Lock size={14} /> {t.authPasswordLabel || "Password"}
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
                    className="w-full rounded-2xl border border-[var(--line)] bg-white/55 px-4 py-3 pr-12 text-base font-medium text-[var(--ink)] outline-none backdrop-blur-xl"
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

              <button
                type="submit"
                disabled={submitting}
                className="stark-btn gap-2 justify-center disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting
                  ? t.authPleaseWait || "Please wait"
                  : mode === "signup"
                    ? t.authCreateAccount || "Create account"
                    : t.authSignIn || "Sign in"}
              </button>

              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                <span className="h-px flex-1 bg-[var(--line)]" />
                {t.authOr || "OR"}
                <span className="h-px flex-1 bg-[var(--line)]" />
              </div>

              <button
                type="button"
                onClick={handleGoogle}
                disabled={submitting}
                className="flex w-fit mx-auto items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-white/60 px-4 py-3 text-sm font-semibold text-[var(--ink)] transition hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-70"
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
                {mode === "signup"
                  ? t.authHaveAccount || "Already have an account?"
                  : t.authNeedAccount || "New here?"}{" "}
                <button
                  type="button"
                  onClick={() =>
                    setMode((prev) => (prev === "signup" ? "signin" : "signup"))
                  }
                  className="font-semibold text-[var(--accent)]"
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
    </div>
  );
};

export default Auth;
