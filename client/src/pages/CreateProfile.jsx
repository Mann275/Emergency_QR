import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../utils/api";
import {
  User,
  Droplets,
  Calendar,
  Phone,
  UserCheck,
  Pill,
  AlertTriangle,
  FileText,
  Loader2,
  ArrowRight,
  ChevronDown,
  HeartPulse,
  Info,
  Eye,
  EyeOff,
  Mail,
  Lock,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { IN, US, GB, AU } from "country-flag-icons/react/3x2";
import { toast } from "react-hot-toast";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const genderOptions = ["Male", "Female", "Other", "Prefer not to say"];
const PHONE_CODES = ["+91", "+1", "+44", "+61"];
const USER_PROFILE_KEY_PREFIX = "emergency_user_profile:";

const getUserProfileKey = (authUid) => `${USER_PROFILE_KEY_PREFIX}${authUid}`;

const parsePhone = (raw) => {
  if (!raw) return ["+91", ""];
  const str = String(raw).trim();
  for (const code of PHONE_CODES) {
    if (str.startsWith(code)) {
      return [code, str.slice(code.length).trim()];
    }
  }
  return ["+91", str.replace(/^\+?\d{1,3}\s*/, "")];
};

const CreateProfile = () => {
  const { t } = useLanguage();
  const {
    user,
    loading: authLoading,
    signIn,
    signUp,
    signInWithGoogle,
  } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authMode, setAuthMode] = useState("signin");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [isProfilePrefilling, setIsProfilePrefilling] = useState(false);
  const [existingProfileId, setExistingProfileId] = useState("");
  const [phoneCode, setPhoneCode] = useState("+91");
  const [emergencyCode, setEmergencyCode] = useState("+91");

  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "",
    bloodGroup: "",
    gender: "",
    phone: "",
    alternatePhone: "",
    emergencyContact: { name: "", phone: "" },
    disease: false,
    diseaseDetails: "",
    allergies: "",
    medications: "",
    address: "",
    notes: "",
  });

  const handleChange = (e) => {
    if (!user) return;
    const { name, value, type, checked } = e.target;
    if (name.startsWith("emergencyContact.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        emergencyContact: { ...prev.emergencyContact, [field]: value },
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePhoneChange = (e, fieldPath) => {
    if (!user) return;
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
    if (fieldPath === "phone") {
      setFormData((prev) => ({ ...prev, phone: digitsOnly }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      emergencyContact: { ...prev.emergencyContact, phone: digitsOnly },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setShowAuthPrompt(true);
      setTimeout(() => {
        document
          .getElementById("auth-panel")
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 0);
      return;
    }
    setLoading(true);

    try {
      if (
        !formData.name ||
        !formData.bloodGroup ||
        !formData.gender ||
        !formData.dateOfBirth ||
        !formData.phone ||
        !formData.emergencyContact.name ||
        !formData.emergencyContact.phone
      ) {
        throw new Error("Please fill in all required fields.");
      }

      const payload = {
        ...formData,
        ownerAuthUid: user?.uid,
        phone: `${phoneCode} ${formData.phone}`,
        emergencyContact: {
          ...formData.emergencyContact,
          phone: `${emergencyCode} ${formData.emergencyContact.phone}`,
        },
      };

      const response = await ApiService.createUser(payload);
      if (response.success) {
        if (user?.uid && response?.data?.uniqueId) {
          localStorage.setItem(
            getUserProfileKey(user.uid),
            response.data.uniqueId,
          );
          setExistingProfileId(response.data.uniqueId);
        }

        toast.success(
          existingProfileId
            ? "Changes saved. Your same QR remains active."
            : "Profile created successfully!",
        );

        navigate(`/success/${response.data.uniqueId}`, {
          state: {
            qrCode: response.data.qrCode,
            profileUrl: response.data.profileUrl,
          },
        });
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setShowAuthPrompt(false);
    }
    const prefillExistingProfile = async () => {
      if (!user?.uid) {
        setExistingProfileId("");
        return;
      }

      const knownProfileId = localStorage.getItem(getUserProfileKey(user.uid));
      if (!knownProfileId) {
        return;
      }

      try {
        setIsProfilePrefilling(true);
        const response = await ApiService.getUserById(knownProfileId);
        if (!response?.success || !response?.data) {
          return;
        }

        const profile = response.data;
        const [pCode, pNum] = parsePhone(profile.phone);
        const [eCode, eNum] = parsePhone(profile.emergencyContact?.phone);

        let dob = "";
        if (profile.dateOfBirth) {
          const dt = new Date(profile.dateOfBirth);
          dob = Number.isNaN(dt.getTime())
            ? ""
            : dt.toISOString().split("T")[0];
        }

        setPhoneCode(pCode);
        setEmergencyCode(eCode);
        setExistingProfileId(knownProfileId);
        setFormData((prev) => ({
          ...prev,
          name: profile.name || "",
          dateOfBirth: dob,
          bloodGroup: profile.bloodGroup || "",
          gender: profile.gender || "",
          phone: pNum,
          alternatePhone: profile.alternatePhone || "",
          emergencyContact: {
            name: profile.emergencyContact?.name || "",
            phone: eNum,
          },
          disease: Boolean(profile.disease),
          diseaseDetails: profile.diseaseDetails || "",
          allergies: profile.allergies || "",
          medications: profile.medications || "",
          address: profile.address || "",
          notes: profile.notes || "",
        }));
      } catch (error) {
        localStorage.removeItem(getUserProfileKey(user.uid));
        setExistingProfileId("");
      } finally {
        setIsProfilePrefilling(false);
      }
    };

    prefillExistingProfile();
  }, [user?.uid]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();

    if (!authEmail || !authPassword) {
      toast.error("Email and password are required.");
      return;
    }

    try {
      setAuthSubmitting(true);
      if (authMode === "signup") {
        await signUp(authEmail, authPassword);
        toast.success("Account created successfully :)");
      } else {
        await signIn(authEmail, authPassword);
        toast.success("Signed in successfully :)");
      }
    } catch (error) {
      toast.error(error.message || "Authentication failed.");
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setAuthSubmitting(true);
      await signInWithGoogle();
      toast.success("Signed in with Google :)");
    } catch (error) {
      toast.error(error.message || "Google sign-in failed.");
    } finally {
      setAuthSubmitting(false);
    }
  };

  const fieldStyle = {
    width: "100%",
    border: "1px solid var(--line)",
    borderRadius: "18px",
    padding: "16px 18px",
    background: "rgba(255,255,255,0.5)",
    color: "var(--ink)",
    fontSize: "17px",
    fontWeight: "500",
    outline: "none",
    backdropFilter: "blur(14px)",
    resize: "none",
  };

  const labelStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: "600",
    letterSpacing: "0.01em",
    marginBottom: "10px",
    color: "var(--muted)",
  };

  const SectionTitle = ({ icon: Icon, title, copy }) => (
    <div className="mb-6 sm:mb-8">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-slate-600 backdrop-blur-xl">
        <Icon size={14} className="text-[var(--accent)]" />
        {title}
      </div>
      {copy && (
        <p className="mt-3 max-w-2xl text-base sm:text-lg leading-relaxed text-[var(--muted)]">
          {copy}
        </p>
      )}
    </div>
  );

  const CustomPhoneSelector = ({ value, onChange, disabled = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const options = [
      { code: "+91", icon: <IN title="India" /> },
      { code: "+1", icon: <US title="USA" /> },
      { code: "+44", icon: <GB title="UK" /> },
      { code: "+61", icon: <AU title="Australia" /> },
    ];

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selected =
      options.find((option) => option.code === value) || options[0];

    return (
      <div
        className="relative min-w-[110px] sm:min-w-[130px]"
        ref={dropdownRef}
      >
        <button
          type="button"
          onClick={() => {
            if (disabled) return;
            setIsOpen(!isOpen);
          }}
          disabled={disabled}
          className="flex w-full items-center gap-2 rounded-2xl border border-[var(--line)] bg-white/55 px-3 py-4 text-base font-medium text-[var(--ink)] backdrop-blur-xl disabled:cursor-not-allowed disabled:opacity-70"
        >
          <div className="flex h-[16px] w-6 items-center justify-center overflow-hidden rounded-sm border border-slate-200">
            {selected.icon}
          </div>
          <span>{selected.code}</span>
          <ChevronDown
            size={14}
            className={`ml-auto opacity-50 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <div className="absolute left-0 top-full z-[120] mt-2 w-full overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-[rgba(255,255,255,0.85)] py-2 shadow-[0_20px_45px_rgba(15,23,42,0.12)] backdrop-blur-xl">
            {options.map((option) => (
              <button
                key={option.code}
                type="button"
                onClick={() => {
                  onChange(option.code);
                  setIsOpen(false);
                }}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-base font-medium text-[var(--ink)] transition-colors hover:bg-white/70"
              >
                <div className="flex h-[16px] w-6 items-center justify-center overflow-hidden rounded-sm border border-slate-200">
                  {option.icon}
                </div>
                {option.code}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const isSignUp = authMode === "signup";
  const isReadOnly = !user;
  const fieldStylePreview = isReadOnly
    ? { ...fieldStyle, opacity: 0.75, cursor: "not-allowed" }
    : fieldStyle;

  return (
    <div
      className="pb-[calc(8rem+env(safe-area-inset-bottom))] sm:pb-24"
      style={{ "--line": "rgba(35, 19, 26, 0.25)" }}
    >
      <section className="pt-16 sm:pt-24 lg:pt-28">
        <div className="main-wrap max-w-3xl">
          <div className="mb-3 animate-slide relative z-30">
            <div className="mx-auto flex max-w-lg items-center justify-center gap-3 text-center">
              <img
                src="/images/illustration3.png"
                alt=""
                className="w-12 sm:w-16 h-auto mix-blend-multiply shrink-0"
              />
              <div className="flex items-center gap-2">
                <h1
                  className="text-2xl sm:text-4xl font-bold text-[var(--ink)] tracking-tight leading-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {t.createTitle}
                </h1>
                <div className="relative group pt-0 sm:pt-1 scale-90 sm:scale-100">
                  <button
                    type="button"
                    aria-label="Why we ask for these details"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[var(--line)] bg-white/80 text-[var(--muted)] shadow-sm transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/30"
                  >
                    <Info size={14} />
                  </button>
                  <div className="absolute left-1/2 top-full z-[400] mt-4 w-64 -translate-x-1/2 rounded-2xl border border-white/70 bg-white/95 p-3 text-left text-[12px] font-medium tracking-normal text-[var(--muted)] shadow-[0_28px_60px_rgba(20,10,18,0.25)] backdrop-blur-xl opacity-0 invisible transition-all duration-300 -translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 pointer-events-none">
                    <div className="absolute -top-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border border-white/70 bg-white/95"></div>
                    {t.createDesc}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="glass-card border-[rgba(35,19,26,0.25)] p-6 sm:p-8 animate-slide"
          >
            {user && isProfilePrefilling ? (
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                <Loader2 size={14} className="animate-spin" /> Loading your
                saved details
              </div>
            ) : user && existingProfileId ? (
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                <HeartPulse size={14} className="text-[var(--accent)]" />{" "}
                Existing profile detected. Updating keeps the same QR.
              </div>
            ) : null}

              <SectionTitle
                icon={User}
                title={t.personalInfo}
                copy="Fill only the information a responder should see immediately."
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label style={labelStyle}>
                    <User size={14} /> {t.fullName}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="E.g. John Doe"
                    required
                    readOnly={isReadOnly}
                    style={fieldStylePreview}
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    <Droplets size={14} /> {t.bloodGroup}
                  </label>
                  <div className="relative">
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      required
                      disabled={isReadOnly}
                      style={{
                        ...(isReadOnly ? fieldStylePreview : fieldStyle),
                        appearance: "none",
                        paddingRight: "44px",
                      }}
                    >
                      <option value="">{t.selectBloodGroup}</option>
                      {bloodGroups.map((group) => (
                        <option key={group} value={group}>
                          {group}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 opacity-40"
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>
                    <UserCheck size={14} /> {t.gender}
                  </label>
                  <div className="relative">
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                      disabled={isReadOnly}
                      style={{
                        ...(isReadOnly ? fieldStylePreview : fieldStyle),
                        appearance: "none",
                        paddingRight: "44px",
                      }}
                    >
                      <option value="">{t.selectGender}</option>
                      {genderOptions.map((gender) => (
                        <option key={gender} value={gender}>
                          {gender}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 opacity-40"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label style={labelStyle}>
                    <Calendar size={14} /> {t.dob}
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                    readOnly={isReadOnly}
                    style={fieldStylePreview}
                  />
                </div>
              </div>

              <div className="my-8 h-px bg-[var(--line)]"></div>

              <SectionTitle
                icon={Phone}
                title={t.emergencyContacts}
                copy="These numbers appear high on the emergency profile, so keep them accurate."
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label style={labelStyle}>
                    <Phone size={14} /> {t.yourPhone}
                  </label>
                  <div className="flex w-full gap-3">
                    <CustomPhoneSelector
                      value={phoneCode}
                      onChange={setPhoneCode}
                      disabled={isReadOnly}
                    />
                    <input
                      className="min-w-0 flex-1"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => handlePhoneChange(e, "phone")}
                      placeholder="1234567890"
                      required
                      readOnly={isReadOnly}
                      style={fieldStylePreview}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>
                    <UserCheck size={14} /> {t.contactName}
                  </label>
                  <input
                    type="text"
                    name="emergencyContact.name"
                    value={formData.emergencyContact.name}
                    onChange={handleChange}
                    placeholder="Someone you trust"
                    required
                    readOnly={isReadOnly}
                    style={fieldStylePreview}
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    <Phone size={14} /> {t.emergencyPhone}
                  </label>
                  <div className="flex w-full gap-3">
                    <CustomPhoneSelector
                      value={emergencyCode}
                      onChange={setEmergencyCode}
                      disabled={isReadOnly}
                    />
                    <input
                      className="min-w-0 flex-1"
                      type="tel"
                      name="emergencyContact.phone"
                      value={formData.emergencyContact.phone}
                      onChange={(e) =>
                        handlePhoneChange(e, "emergencyContact.phone")
                      }
                      placeholder="1234567890"
                      required
                      readOnly={isReadOnly}
                      style={fieldStylePreview}
                    />
                  </div>
                </div>
              </div>

              <div className="my-8 h-px bg-[var(--line)]"></div>

              <SectionTitle
                icon={HeartPulse}
                title={t.medicalHistory}
                copy="Add only the details that are helpful during an emergency."
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label style={labelStyle}>
                    <AlertTriangle size={14} /> {t.chronicConditions}
                  </label>
                  <textarea
                    name="diseaseDetails"
                    value={formData.diseaseDetails}
                    onChange={handleChange}
                    placeholder="Asthma, diabetes, epilepsy..."
                    readOnly={isReadOnly}
                    style={{ ...fieldStylePreview, minHeight: "96px" }}
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    <Droplets size={14} /> {t.knownAllergies}
                  </label>
                  <input
                    type="text"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    placeholder="Penicillin, peanuts..."
                    readOnly={isReadOnly}
                    style={fieldStylePreview}
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    <Pill size={14} /> {t.medications}
                  </label>
                  <input
                    type="text"
                    name="medications"
                    value={formData.medications}
                    onChange={handleChange}
                    placeholder="Current medication..."
                    readOnly={isReadOnly}
                    style={fieldStylePreview}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label style={labelStyle}>
                    <FileText size={14} /> {t.responderNotes}
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Example: carries inhaler in bag pocket."
                    readOnly={isReadOnly}
                    style={{ ...fieldStylePreview, minHeight: "88px" }}
                  />
                </div>
              </div>

              <div className="mt-10 flex flex-col gap-5 border-t border-[var(--line)] pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-md text-base sm:text-lg leading-relaxed text-[var(--muted)]">
                  {t.disclaimer}
                </p>

                <button
                  type="submit"
                  disabled={loading}
                  className="stark-btn gap-3 shrink-0 whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> {t.working}
                    </>
                  ) : (
                    <>
                      {existingProfileId
                        ? t.updateProfile || "Save changes"
                        : t.generateQr}{" "}
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
          </form>

          {!user && showAuthPrompt && (
            <div
              id="auth-panel"
              className="glass-card border-[rgba(35,19,26,0.25)] p-6 sm:p-8 animate-slide relative z-0 max-w-lg w-full mx-auto mt-6"
            >
              {authLoading ? (
                <div className="flex items-center gap-2 text-[var(--muted)]">
                  <Loader2 size={16} className="animate-spin" />
                  Checking authentication...
                </div>
              ) : (
                <form onSubmit={handleAuthSubmit} className="grid gap-5">
                  <div className="grid gap-2">
                    <label style={labelStyle}>
                      <Mail size={14} /> Email
                    </label>
                    <input
                      type="email"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder={
                        isSignUp
                          ? "Enter a new email address"
                          : "Enter your account email"
                      }
                      required
                      style={fieldStyle}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label style={labelStyle}>
                      <Lock size={14} /> Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        placeholder={
                          isSignUp
                            ? "Create password (min 6 characters)"
                            : "Enter your password"
                        }
                        minLength={6}
                        required
                        style={{ ...fieldStyle, paddingRight: "46px" }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] transition hover:text-[var(--ink)]"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
                    <button
                      type="submit"
                      disabled={authSubmitting}
                      className="stark-btn gap-2 disabled:cursor-not-allowed disabled:opacity-70 w-full sm:w-fit justify-center"
                    >
                      {authSubmitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Please wait
                        </>
                      ) : isSignUp ? (
                        "Create account"
                      ) : (
                        "Sign in"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setAuthMode(isSignUp ? "signin" : "signup")
                      }
                      className="rounded-full border border-[var(--line)] bg-white/45 px-3.5 py-2 text-sm font-semibold text-[var(--muted)] transition hover:bg-white/70 w-full sm:w-fit"
                    >
                      {isSignUp
                        ? "Use your existing account"
                        : "Create a new account"}
                    </button>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                    <span className="h-px flex-1 bg-[var(--line)]" />
                    OR
                    <span className="h-px flex-1 bg-[var(--line)]" />
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={authSubmitting}
                      className="flex w-fit mx-auto items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-white/60 px-4 py-3 text-sm font-semibold text-[var(--ink)] transition hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <span className="flex h-5 w-5 items-center justify-center">
                        <svg viewBox="0 0 48 48" className="h-5 w-5">
                          <path fill="#EA4335" d="M24 9.5c3.4 0 6.5 1.2 8.9 3.2l6.6-6.6C35.7 2.4 30.2 0 24 0 14.6 0 6.4 5.4 2.6 13.2l7.8 6.1C12.1 13.2 17.6 9.5 24 9.5z" />
                          <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-2.8-.4-4.1H24v7.8h12.7c-.6 3-2.3 5.5-4.9 7.2l7.6 5.8c4.5-4.2 7.1-10.4 7.1-16.7z" />
                          <path fill="#FBBC05" d="M10.4 28.7c-1-3-1-6.4 0-9.4l-7.8-6.1C-.7 18.7-.7 29.3 2.6 35.8l7.8-7.1z" />
                          <path fill="#34A853" d="M24 48c6.2 0 11.4-2.1 15.2-5.7l-7.6-5.8c-2.1 1.4-4.8 2.2-7.6 2.2-6.4 0-11.9-3.7-14.6-9l-7.8 7.1C6.4 42.6 14.6 48 24 48z" />
                        </svg>
                      </span>
                      {isSignUp
                        ? "Continue with Google (Sign up)"
                        : "Continue with Google"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CreateProfile;
