import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
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
  ArrowLeft,
  ChevronDown,
  Pencil,
  HeartPulse,
  Info,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { IN, US, GB, AU } from "country-flag-icons/react/3x2";
import { toast } from "react-hot-toast";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const genderOptions = ["Male", "Female", "Other", "Prefer not to say"];

const phoneCodes = ["+91", "+1", "+44", "+61"];

/** Split a stored phone string like "+91 1234567890" into [code, number]. */
const parsePhone = (raw) => {
  if (!raw) return ["+91", ""];
  const str = String(raw).trim();
  for (const code of phoneCodes) {
    if (str.startsWith(code)) {
      return [code, str.slice(code.length).trim()];
    }
  }
  return ["+91", str.replace(/^\+?\d{1,3}\s*/, "")];
};

const EditProfile = () => {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
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

  // Fetch existing profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!ApiService.hasEditToken(id)) {
        setAccessDenied(true);
        setFetching(false);
        return;
      }

      try {
        const response = await ApiService.getUserById(id);
        if (response.success) {
          const d = response.data;

          // Parse phone codes
          const [pCode, pNum] = parsePhone(d.phone);
          const [eCode, eNum] = parsePhone(d.emergencyContact?.phone);
          setPhoneCode(pCode);
          setEmergencyCode(eCode);

          // Format dateOfBirth for <input type="date">
          let dob = "";
          if (d.dateOfBirth) {
            const dt = new Date(d.dateOfBirth);
            dob = dt.toISOString().split("T")[0];
          }

          setFormData({
            name: d.name || "",
            dateOfBirth: dob,
            bloodGroup: d.bloodGroup || "",
            gender: d.gender || "",
            phone: pNum,
            alternatePhone: d.alternatePhone || "",
            emergencyContact: {
              name: d.emergencyContact?.name || "",
              phone: eNum,
            },
            disease: d.disease || false,
            diseaseDetails: d.diseaseDetails || "",
            allergies: d.allergies || "",
            medications: d.medications || "",
            address: d.address || "",
            notes: d.notes || "",
          });
        }
      } catch (err) {
        toast.error(err.message || "Failed to load profile.");
      } finally {
        setFetching(false);
      }
    };

    fetchProfile();
  }, [id]);

  const handleChange = (e) => {
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
        phone: `${phoneCode} ${formData.phone}`,
        emergencyContact: {
          ...formData.emergencyContact,
          phone: `${emergencyCode} ${formData.emergencyContact.phone}`,
        },
      };

      const response = await ApiService.updateUser(id, payload);
      if (response.success) {
        toast.success(t.profileUpdated || "Profile updated successfully!");

        navigate(`/emergency/${id}`);
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
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
      <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-3 py-2 text-xs font-semibold text-slate-600 backdrop-blur-xl">
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

  const CustomPhoneSelector = ({ value, onChange }) => {
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
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center gap-2 rounded-2xl border border-[var(--line)] bg-white/55 px-3 py-4 text-base font-medium text-[var(--ink)] backdrop-blur-xl"
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

  // Loading skeleton
  if (fetching) {
    return (
      <div className="pb-24">
        <section className="pt-20 sm:pt-28">
          <div className="main-wrap max-w-3xl">
            <div className="text-center py-20 animate-slide">
              <HeartPulse
                size={42}
                className="mx-auto text-[var(--accent)] animate-pulse"
              />
              <p className="mt-4 text-base font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                {t.retrieving || "Loading profile..."}
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="pb-24">
        <section className="pt-20 sm:pt-28">
          <div className="main-wrap max-w-3xl">
            <div className="glass-card p-6 sm:p-8 text-center animate-slide">
              <AlertTriangle
                size={34}
                className="mx-auto text-[var(--danger)]"
              />
              <h1
                className="mt-3 text-2xl sm:text-3xl font-bold text-[var(--ink)]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Edit not allowed
              </h1>
              <p className="mt-3 text-[var(--muted)]">
                Only the original creator can edit this profile from the same
                device/browser.
              </p>
              <Link
                to={`/emergency/${id}`}
                className="stark-btn mt-6 inline-flex gap-2"
              >
                <ArrowLeft size={14} /> Back to profile
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <section className="pt-20 sm:pt-28">
        <div className="main-wrap max-w-3xl">
          {/* Header */}
          <div className="text-center mb-8 animate-slide">
            <div className="flex flex-row items-center justify-center gap-4 sm:gap-6 mb-4">
              <img
                src="/images/illustration2.png"
                alt=""
                className="w-14 sm:w-28 h-auto mix-blend-multiply shrink-0"
              />
              <div className="flex items-center gap-2">
                <h1
                  className="text-3xl sm:text-5xl font-bold text-[var(--ink)] tracking-tight leading-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {t.editTitle || "Edit your profile"}
                </h1>
                <div className="relative group pt-0.5">
                  <button
                    type="button"
                    aria-label="Edit profile information"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[var(--line)] bg-white/80 text-[var(--muted)] shadow-sm transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/30"
                  >
                    <Info size={14} />
                  </button>
                  <div className="absolute left-1/2 top-full z-30 mt-2 w-64 -translate-x-1/2 rounded-2xl border border-white/70 bg-white/95 p-3 text-left text-[12px] font-medium tracking-normal text-[var(--muted)] shadow-[0_28px_60px_rgba(20,10,18,0.25)] backdrop-blur-xl opacity-0 invisible transition-all duration-300 -translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 pointer-events-none origin-top">
                    <div className="absolute -top-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border border-white/70 bg-white/95"></div>
                    Update your medical details. Changes will reflect on your emergency QR immediately.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="glass-card p-6 sm:p-8 animate-slide"
          >
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
                  style={fieldStyle}
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
                    style={{
                      ...fieldStyle,
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
                    style={{
                      ...fieldStyle,
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
                  style={fieldStyle}
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
                  />
                  <input
                    className="min-w-0 flex-1"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => handlePhoneChange(e, "phone")}
                    placeholder="1234567890"
                    required
                    style={fieldStyle}
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
                  style={fieldStyle}
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
                    style={fieldStyle}
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
                  style={{ ...fieldStyle, minHeight: "96px" }}
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
                  style={fieldStyle}
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
                  style={fieldStyle}
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
                  style={{ ...fieldStyle, minHeight: "88px" }}
                />
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-5 border-t border-[var(--line)] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-md text-base sm:text-lg leading-relaxed text-[var(--muted)]">
                {t.disclaimer}
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="stark-btn gap-2 shrink-0 whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />{" "}
                      {t.updating || "Updating..."}
                    </>
                  ) : (
                    <>{t.updateProfile || "Update profile"}</>
                  )}
                </button>
                <Link
                  to={`/emergency/${id}`}
                  className="ghost-btn gap-2 px-5 py-3 text-sm shrink-0 border border-[var(--line)] text-[var(--muted)]"
                >
                  {t.cancelEdit || "Cancel"}
                </Link>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
