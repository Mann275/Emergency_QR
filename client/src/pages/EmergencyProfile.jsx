import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ApiService from "../utils/api";
import {
  ArrowLeft,
  Phone,
  Activity,
  FileText,
  ShieldAlert,
  User,
  ShieldCheck,
  HeartPulse,
  AlertTriangle,
  Calendar,
  BadgeAlert,
  Loader2,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useServerHealth } from "../context/ServerHealthContext";

const EmergencyProfile = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const { isHealthy, isChecking } = useServerHealth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await ApiService.getUserById(id);
        if (response.success) {
          setUser(response.data);
        } else {
          setError(t.notFound);
        }
      } catch (err) {
        setError(t.failedLoad);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, t.failedLoad, t.notFound]);

  const GlassCard = ({ children, className = "", style = {} }) => (
    <div className={`glass-card ${className}`} style={style}>
      {children}
    </div>
  );

  const Pill = ({ icon: Icon, label, tone = "default" }) => (
    <div
      className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs sm:text-[11px] font-bold uppercase tracking-[0.18em] sm:tracking-[0.22em]"
      style={{
        borderColor:
          tone === "danger" ? "rgba(225, 29, 72, 0.16)" : "var(--glass-border)",
        background:
          tone === "danger"
            ? "rgba(255, 241, 242, 0.7)"
            : "rgba(255,255,255,0.6)",
        color: tone === "danger" ? "var(--danger)" : "var(--muted)",
      }}
    >
      <Icon size={13} />
      {label}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <GlassCard className="p-8 sm:p-10 text-center max-w-md w-full">
          <HeartPulse
            size={42}
            className="mx-auto text-[var(--accent)] animate-pulse"
          />
          <p className="mt-4 text-base font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
            {t.retrieving}
          </p>
        </GlassCard>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <GlassCard className="p-8 sm:p-10 text-center max-w-md w-full">
          <ShieldAlert size={46} className="mx-auto text-rose-600" />
          <h1
            className="mt-5 text-3xl font-bold text-[var(--ink)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {t.accessError}
          </h1>
          <p className="mt-3 text-base text-[var(--muted)]">{error}</p>
          <Link to="/" className="stark-btn mt-8 inline-flex">
            {t.returnHome}
          </Link>
        </GlassCard>
      </div>
    );
  }

  const contact = user.emergencyContact || {};
  const primaryName = contact.name || t.notSpecified;
  const primaryPhone = (contact.phone || user.phone || "").toString();
  const backupPhone = (user.phone || "").toString();
  const bloodGroup = user.bloodGroup || "N/A";
  const age = user.age ? `${user.age} yrs` : "N/A";
  const gender = user.gender || t.notSpecified;
  const dob = user.dateOfBirth
    ? new Date(user.dateOfBirth).toLocaleDateString()
    : "N/A";

  const criticalItems = [
    {
      label: t.allergies,
      value: user.allergies || t.noneDisclosed,
      danger: Boolean(user.allergies),
    },
    {
      label: t.medications,
      value: user.medications || t.noneDisclosed,
      danger: false,
    },
    {
      label: t.condition,
      value: user.diseaseDetails || t.noneDisclosed,
      danger: Boolean(user.diseaseDetails),
    },
  ];

  const facts = [
    { label: t.fullName, value: user.name || t.notSpecified, icon: User },
    { label: t.gender, value: gender, icon: BadgeAlert },
    { label: t.dob, value: dob, icon: Calendar },
    { label: t.age, value: age, icon: Activity },
  ];

  const personalNumberLabel = t.yourNumber;
  const callEmergencyContactLabel = t.callEmergencyContact;
  const callPersonalNumberLabel = t.callYourNumber;

  return (
    <div className="min-h-screen pb-10 sm:pb-16">
      {/* Server Health Banner */}
      {!isHealthy && (
        <div
          className="fixed top-0 left-0 right-0 z-50 px-4 py-3 text-center text-sm font-semibold shadow-lg"
          style={{
            background: isChecking
              ? "linear-gradient(90deg, #f59e0b 0%, #f97316 100%)"
              : "linear-gradient(90deg, #ef4444 0%, #dc2626 100%)",
            color: "#ffffff",
          }}
        >
          <div className="flex items-center justify-center gap-2">
            {isChecking ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Server is starting... Please wait</span>
              </>
            ) : (
              <>
                <AlertTriangle size={16} />
                <span>
                  Server is not responding. Please check your connection or try
                  again later.
                </span>
              </>
            )}
          </div>
        </div>
      )}

      <section className="pt-2 sm:pt-8">
        <div className="main-wrap max-w-6xl">
          <div className="mb-3 sm:mb-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3">
            <Link
              to="/"
              className="inline-flex items-center justify-center sm:justify-start gap-2 rounded-full border border-white/70 bg-white/65 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base font-semibold text-[var(--ink)] shadow-[0_12px_26px_rgba(60,22,34,0.06)] backdrop-blur-xl"
            >
              <ArrowLeft size={16} />
              Back
            </Link>

            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2">
              <Pill icon={ShieldCheck} label={t.emergencyProfile} />
              <Pill icon={HeartPulse} label={t.active} tone="danger" />
            </div>
          </div>

          <div className="grid gap-3 sm:gap-5 lg:grid-cols-[1.15fr,0.85fr]">
            <GlassCard className="p-3 sm:p-7 lg:p-8 overflow-hidden">
              <div className="grid gap-4 sm:gap-6 lg:grid-cols-[0.82fr,1.18fr] items-start">
                <div className="rounded-[22px] sm:rounded-[28px] border border-white/75 bg-white/80 p-3 sm:p-6 text-center">
                  <div className="text-[11px] sm:text-[13px] font-semibold tracking-[0.03em] text-[var(--muted)]">
                    {t.bloodGroupLabel}
                  </div>
                  <div
                    className="mt-3 sm:mt-4 text-4xl min-[220px]:text-5xl sm:text-7xl font-black text-rose-600 break-words"
                    style={{
                      fontFamily: "var(--font-heading)",
                      lineHeight: "0.95",
                    }}
                  >
                    {bloodGroup}
                  </div>
                  <div className="mt-4 sm:mt-6 inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-rose-50 px-2.5 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.12em] sm:tracking-[0.16em] text-[var(--accent)]">
                    <ShieldCheck size={13} />
                    {t.verified}
                  </div>
                </div>

                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-[13px] font-semibold tracking-[0.03em] text-[var(--muted)]">
                    <AlertTriangle size={14} className="text-rose-600" />
                    {t.scannerFirstView}
                  </div>

                  <h1
                    className="mt-3 sm:mt-5 text-2xl min-[220px]:text-3xl sm:text-5xl font-bold text-[var(--ink)] break-words"
                    style={{
                      fontFamily: "var(--font-heading)",
                      lineHeight: "0.98",
                    }}
                  >
                    {user.name || t.notSpecified}
                  </h1>

                  <p className="mt-3 sm:mt-4 max-w-2xl text-sm min-[220px]:text-[15px] sm:text-lg leading-relaxed text-[var(--muted)]">
                    {t.emergencyDetailsArranged}
                  </p>

                  <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <a
                      href={`tel:${primaryPhone.replace(/\s+/g, "")}`}
                      className="stark-btn gap-2 sm:gap-3 justify-center px-3 sm:px-7 py-2.5 sm:py-3.5 text-sm sm:text-[15px]"
                    >
                      <Phone size={14} />
                      {callEmergencyContactLabel}
                    </a>

                    {backupPhone && backupPhone !== primaryPhone && (
                      <a
                        href={`tel:${backupPhone.replace(/\s+/g, "")}`}
                        className="ghost-btn gap-2 sm:gap-3 justify-center px-3 sm:px-7 py-2.5 sm:py-3.5 text-sm sm:text-[15px]"
                      >
                        <User size={14} />
                        {callPersonalNumberLabel}
                      </a>
                    )}
                  </div>

                  <div className="mt-4 sm:mt-6 grid gap-2 sm:gap-3 sm:grid-cols-2">
                    <div className="rounded-[18px] sm:rounded-[22px] border border-white/70 bg-white/70 p-3 sm:p-4">
                      <div className="text-[11px] sm:text-[13px] font-semibold tracking-[0.02em] text-[var(--muted)]">
                        {t.emergencyContactLabel}
                      </div>
                      <div className="mt-1.5 sm:mt-2 text-base min-[220px]:text-lg sm:text-xl font-semibold text-[var(--ink)] break-words">
                        {primaryName}
                      </div>
                      <div className="mt-1 text-[13px] min-[220px]:text-[15px] sm:text-[17px] text-[var(--ink)] break-all">
                        {primaryPhone || "N/A"}
                      </div>
                    </div>
                    <div className="rounded-[18px] sm:rounded-[22px] border border-white/70 bg-white/70 p-3 sm:p-4">
                      <div className="text-[11px] sm:text-[13px] font-semibold tracking-[0.02em] text-[var(--muted)]">
                        {personalNumberLabel}
                      </div>
                      <div className="mt-1.5 sm:mt-2 text-base min-[220px]:text-lg sm:text-xl font-semibold text-[var(--ink)] break-all">
                        {backupPhone || "N/A"}
                      </div>
                      <div className="mt-1 text-[12px] min-[220px]:text-[13px] sm:text-[15px] text-[var(--muted)] break-all">
                        {t.profileRef}: {user.uniqueId?.slice(0, 8) || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-3 sm:p-7 lg:p-8">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] sm:text-[13px] font-semibold tracking-[0.02em] text-[var(--muted)]">
                    {t.quickIdentity}
                  </div>
                  <h2
                    className="mt-1.5 sm:mt-2 text-lg min-[220px]:text-xl sm:text-2xl font-semibold text-[var(--ink)]"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {t.patientFacts}
                  </h2>
                </div>
                <div className="flex h-9 w-9 min-[220px]:h-10 min-[220px]:w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-white/70 text-[var(--accent)] shrink-0">
                  <HeartPulse size={18} className="sm:hidden" />
                  <HeartPulse size={22} className="hidden sm:block" />
                </div>
              </div>

              <div className="mt-3 sm:mt-6 grid gap-2 sm:gap-3">
                {facts.map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    className="rounded-[18px] sm:rounded-[22px] border border-white/70 bg-white/70 p-3 sm:p-4"
                  >
                    <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-[13px] font-semibold tracking-[0.02em] text-[var(--muted)]">
                      <Icon size={12} className="sm:hidden" />
                      <Icon size={13} className="hidden sm:block" />
                      {label}
                    </div>
                    <div className="mt-1.5 sm:mt-2 text-base min-[220px]:text-lg sm:text-xl font-semibold text-[var(--ink)] break-words">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          <div className="mt-3 sm:mt-5 grid gap-3 sm:gap-5 lg:grid-cols-[1fr,0.9fr]">
            <GlassCard className="p-3 sm:p-7 lg:p-8">
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-[13px] font-semibold tracking-[0.02em] text-[var(--muted)]">
                <Activity
                  size={12}
                  className="text-[var(--accent)] sm:hidden"
                />
                <Activity
                  size={14}
                  className="text-[var(--accent)] hidden sm:block"
                />
                {t.medicalDetails}
              </div>

              <div className="mt-3 sm:mt-5 grid gap-2 sm:gap-3">
                {criticalItems.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[18px] sm:rounded-[24px] border p-3 sm:p-5"
                    style={{
                      borderColor: item.danger
                        ? "rgba(225, 29, 72, 0.15)"
                        : "var(--glass-border)",
                      background: item.danger
                        ? "rgba(255, 241, 242, 0.78)"
                        : "rgba(255,255,255,0.72)",
                    }}
                  >
                    <div
                      className="text-[11px] sm:text-[13px] font-semibold tracking-[0.02em]"
                      style={{
                        color: item.danger ? "var(--danger)" : "var(--muted)",
                      }}
                    >
                      {item.label}
                    </div>
                    <div className="mt-2 sm:mt-3 text-sm min-[220px]:text-base sm:text-xl font-semibold leading-relaxed text-[var(--ink)] break-all sm:break-words">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              {user.notes && (
                <div className="mt-3 sm:mt-4 rounded-[18px] sm:rounded-[24px] border border-dashed border-[var(--line)] bg-white/60 p-3 sm:p-5">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-[13px] font-semibold tracking-[0.02em] text-[var(--muted)]">
                    <FileText size={12} className="sm:hidden" />
                    <FileText size={13} className="hidden sm:block" />
                    {t.instructions}
                  </div>
                  <p className="mt-2 sm:mt-3 text-sm min-[220px]:text-base sm:text-lg leading-relaxed text-[var(--ink)] break-all sm:break-words">
                    {user.notes}
                  </p>
                </div>
              )}
            </GlassCard>

            <GlassCard className="p-3 sm:p-7 lg:p-8">
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-[13px] font-semibold tracking-[0.02em] text-[var(--muted)]">
                <ShieldCheck
                  size={12}
                  className="text-[var(--accent)] sm:hidden"
                />
                <ShieldCheck
                  size={14}
                  className="text-[var(--accent)] hidden sm:block"
                />
                {t.verifiedLog}
              </div>

              <div className="mt-3 sm:mt-5 rounded-[18px] sm:rounded-[24px] border border-white/70 bg-white/55 p-3 sm:p-5">
                <div className="text-sm min-[220px]:text-[15px] sm:text-base leading-relaxed text-[var(--muted)] break-words">
                  {t.clinicalDisclaimer}
                </div>
                <div className="mt-3 sm:mt-5 grid gap-2 sm:gap-3 sm:grid-cols-2">
                  <div className="rounded-[16px] sm:rounded-[20px] bg-white/78 p-3 sm:p-4">
                    <div className="text-[11px] sm:text-[13px] font-semibold tracking-[0.02em] text-[var(--muted)]">
                      {t.recordId}
                    </div>
                    <div className="mt-1.5 sm:mt-2 text-xs min-[220px]:text-sm sm:text-base font-semibold text-[var(--ink)] break-all">
                      {user.uniqueId || "N/A"}
                    </div>
                  </div>
                  <div className="rounded-[16px] sm:rounded-[20px] bg-white/78 p-3 sm:p-4">
                    <div className="text-[11px] sm:text-[13px] font-semibold tracking-[0.02em] text-[var(--muted)]">
                      {t.status}
                    </div>
                    <div className="mt-1.5 sm:mt-2 text-xs min-[220px]:text-sm sm:text-base font-semibold text-[var(--accent)]">
                      {t.activeAndVerified}
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EmergencyProfile;
