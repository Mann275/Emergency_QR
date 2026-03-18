import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import QRCode from "qrcode";
import {
  User,
  Languages,
  ChevronDown,
  LogOut,
  UserCircle2,
  PencilLine,
  QrCode,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { showToast } from "../utils/toast.jsx";

const USER_PROFILE_KEY_PREFIX = "emergency_user_profile:";
const getUserProfileKey = (authUid) => `${USER_PROFILE_KEY_PREFIX}${authUid}`;

const Header = () => {
  const { lang, setLang, t } = useLanguage();
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [profileId, setProfileId] = useState("");
  const langDropdownRef = useRef(null);
  const accountDropdownRef = useRef(null);

  useEffect(() => {
    if (!user?.uid) {
      setProfileId("");
      return;
    }

    const stored = localStorage.getItem(getUserProfileKey(user.uid)) || "";
    setProfileId(stored);
  }, [user?.uid, location.pathname]);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    try {
      await logout();
      setIsAccountOpen(false);
      setShowLogoutConfirm(false);
      showToast({
        message: t.logoutSuccess || "Logged out successfully.",
      });
    } catch (error) {
      toast.error(error.message || t.logoutFailed || "Failed to logout.");
    }
  };

  const handleDownloadQr = async () => {
    if (!profileId) {
      toast.error(
        t.profileFirstDownload || "Create your profile first to download QR.",
      );
      return;
    }

    try {
      const profileUrl = `${window.location.origin}/emergency/${profileId}`;
      const dataUrl = await QRCode.toDataURL(profileUrl, {
        width: 256,
        margin: 1,
      });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `emergency-qr-${profileId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsAccountOpen(false);
      toast.success(t.qrDownloaded || "QR downloaded.");
    } catch (error) {
      toast.error(t.qrGenerateFailed || "Could not generate QR right now.");
    }
  };

  const languages = [
    { code: "en", label: "EN" },
    { code: "hi", label: "हिन्दी" },
    { code: "gu", label: "ગુજરાતી" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target)
      ) {
        setIsLangOpen(false);
      }

      if (
        accountDropdownRef.current &&
        !accountDropdownRef.current.contains(event.target)
      ) {
        setIsAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLang = languages.find((l) => l.code === lang) || languages[0];

  return (
    <>
      <header className="glass-nav px-4 py-3 sm:px-6 sm:py-4">
        <nav className="flex items-center justify-between gap-3">
          <Link
            to="/"
            className="flex items-center gap-3 text-slate-900 transition-base min-w-0"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/60 bg-white/70 shadow-[0_12px_30px_rgba(60,22,34,0.08)]">
              <img
                src="https://ik.imagekit.io/shubhampathak/emergency-qr/logo_no_text.png"
                alt="Emergency QR Logo"
                className="h-6 w-6 object-contain"
              />
            </span>
            <span className="min-w-0">
              <span
                className="block text-lg font-bold tracking-tight"
                style={{ fontFamily: "var(--font-heading)" }}
                data-t="brandTitle"
              >
                Emergency QR
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-2 md:gap-4 sm:gap-8 overflow-visible">
            <div className="relative" ref={langDropdownRef}>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 md:gap-2 px-3 py-2 rounded-full border border-white/50 bg-white/65 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition-all duration-300 active:scale-95"
                style={{
                  color: "var(--ink)",
                }}
              >
                <Languages size={16} />
                <span className="text-[12px] font-bold">
                  {currentLang.label}
                </span>
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-300 ${isLangOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isLangOpen && (
                <div
                  className="absolute top-full right-0 mt-2 w-32 py-2 rounded-2xl border shadow-xl z-[150] animate-in fade-in slide-in-from-top-2 duration-200"
                  style={{
                    background: "rgba(255,255,255,0.82)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    borderColor: "var(--glass-border)",
                  }}
                >
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLang(l.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-[13px] font-bold transition-colors hover:bg-white/70 ${lang === l.code ? "text-accent" : ""}`}
                      style={{ color: "var(--ink)" }}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 sm:gap-6">
              {!user && (
                <Link
                  to="/create"
                  className="hidden md:flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2.5 text-sm font-bold text-white transition-all duration-300 group shadow-[0_18px_35px_rgba(214,31,69,0.22)]"
                  aria-label="Create Profile"
                >
                  <User
                    size={18}
                    className="transition-transform group-hover:scale-110"
                  />
                  <span data-t="createProfile">{t.createProfile}</span>
                </Link>
              )}

              {user && (
                <div className="relative" ref={accountDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsAccountOpen(!isAccountOpen)}
                    className="flex items-center gap-2 rounded-full border border-white/50 bg-white/65 px-3 py-2 text-sm font-bold text-[var(--ink)] shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition-all duration-300"
                  >
                    <UserCircle2 size={16} />
                    <span className="hidden sm:inline">
                      {t.accountGreeting
                        ? t.accountGreeting.replace(
                            "{name}",
                            user?.displayName || t.userFallback || "there",
                          )
                        : `Hi, ${user?.displayName || "there"}!`}
                    </span>
                    <ChevronDown
                      size={12}
                      className={`transition-transform duration-300 ${isAccountOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isAccountOpen && (
                    <div
                      className="absolute top-full right-0 mt-2 w-52 overflow-hidden rounded-2xl border shadow-xl z-[160]"
                      style={{
                        background: "rgba(255,255,255,0.9)",
                        backdropFilter: "blur(14px)",
                        WebkitBackdropFilter: "blur(14px)",
                        borderColor: "var(--glass-border)",
                      }}
                    >
                      {profileId ? (
                        <>
                          <Link
                            to={`/edit/${profileId}`}
                            onClick={() => setIsAccountOpen(false)}
                            className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-[var(--ink)] hover:bg-white/75"
                          >
                            <PencilLine size={15} />{" "}
                            <span data-t="editProfile">
                              {t.editProfile || "Edit Profile"}
                            </span>
                          </Link>
                          <button
                            type="button"
                            onClick={handleDownloadQr}
                            className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-[var(--ink)] hover:bg-white/75"
                          >
                            <QrCode size={15} />{" "}
                            <span data-t="downloadQr">
                              {t.downloadQr || "Download QR"}
                            </span>
                          </button>
                        </>
                      ) : (
                        <Link
                          to="/create"
                          onClick={() => setIsAccountOpen(false)}
                          className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-[var(--ink)] hover:bg-white/75"
                        >
                          <User size={15} />{" "}
                          <span data-t="createProfile">
                            {t.createProfile || "Create Profile"}
                          </span>
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 border-t border-white/70 px-4 py-3 text-left text-sm font-semibold text-[var(--muted)] hover:bg-white/75"
                      >
                        <LogOut size={15} />{" "}
                        <span data-t="logout">{t.logout || "Logout"}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 px-4"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            className="glass-card w-full max-w-sm p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <h3
              className="text-lg font-semibold text-[var(--ink)]"
              style={{ fontFamily: "var(--font-heading)" }}
              data-t="logout"
            >
              {t.logout || "Logout"}
            </h3>
            <p
              className="mt-2 text-sm text-[var(--muted)]"
              data-t="logoutConfirm"
            >
              {t.logoutConfirm || "Are you sure you want to logout?"}
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={confirmLogout}
                className="stark-btn w-full justify-center"
                data-t="logout"
              >
                {t.logout || "Logout"}
              </button>
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="ghost-btn w-full justify-center"
                data-t="cancelEdit"
              >
                {t.cancelEdit || "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
