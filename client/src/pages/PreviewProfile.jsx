import { Link } from "react-router-dom";
import {
  Phone,
  AlertTriangle,
  User,
  HeartPulse,
  ShieldCheck,
  Calendar,
  FileText,
  Stethoscope,
  Cake,
  VenusAndMars,
  ArrowLeft,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const PreviewProfile = () => {
  const { t } = useLanguage();

  const previewUser = {
    name: "Ananya Sharma",
    bloodGroup: "O+",
    gender: "Female",
    dateOfBirth: new Date("1995-07-12"),
    phone: "+91 98765 43210",
    emergencyContact: {
      name: "Rohan Sharma",
      phone: "+91 98111 22233",
    },
    allergies: "Penicillin",
    medications: "Metformin 500mg",
    diseaseDetails: "Type 2 diabetes (managed)",
    notes: "Carries insulin pen in bag pocket.",
    uniqueId: "preview-001",
  };

  const bloodGroup = previewUser.bloodGroup;
  const age = previewUser.dateOfBirth
    ? new Date().getFullYear() - previewUser.dateOfBirth.getFullYear()
    : "N/A";

  const facts = [
    { label: t.fullName, value: previewUser.name, icon: User },
    { label: t.gender, value: previewUser.gender, icon: VenusAndMars },
    {
      label: t.dob,
      value: previewUser.dateOfBirth.toLocaleDateString(),
      icon: Calendar,
    },
    { label: t.age, value: `${age} yrs`, icon: Cake },
  ];

  const criticalItems = [
    { label: t.allergies, value: previewUser.allergies, danger: true },
    { label: t.medications, value: previewUser.medications, danger: false },
    { label: t.condition, value: previewUser.diseaseDetails, danger: true },
  ];

  const GlassCard = ({ children, className = "" }) => (
    <div className={`glass-card ${className}`}>{children}</div>
  );

  return (
    <div className="min-h-screen pb-[calc(10rem+env(safe-area-inset-bottom))] sm:pb-16">
      <section className="pt-24 sm:pt-32">
        <div className="main-wrap max-w-5xl">
          <div className="mb-6 px-4 sm:px-6">
            <Link
              to="/"
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
              data-t="back"
            >
              <ArrowLeft size={16} />
              {t.back || "Back"}
            </Link>
            <div className="text-left">
              <p
                className="text-sm sm:text-base font-bold text-[var(--ink)] opacity-80"
                data-t="previewNote"
              >
                {t.previewNote ||
                  "Preview only - real profiles will show your submitted details."}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2 lg:gap-8">
            {/* Left Card: Identity & Call Actions */}
            <GlassCard className="p-4 sm:p-7">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[12px] font-semibold text-[var(--muted)]">
                    <User size={14} className="text-[var(--accent)]" />
                    <span data-t="patientFacts">{t.patientFacts || "User details"}</span>
                  </div>

                  <div className="mt-3 grid gap-2">
                    <div
                      className="rounded-[14px] border p-2.5"
                      style={{
                        borderColor: "var(--glass-border)",
                        background: "rgba(255,255,255,0.7)",
                      }}
                    >
                      <div className="text-[11px] font-semibold text-[var(--muted)]" data-t="bloodGroupLabel">
                        {t.bloodGroupLabel}
                      </div>
                      <div
                        className="mt-1 text-2xl font-black text-rose-600"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {bloodGroup}
                      </div>
                    </div>

                    {facts.map(({ label, value, icon: Icon }) => (
                      <div
                        key={label}
                        className="rounded-[14px] border p-2.5 flex items-center justify-between gap-3"
                        style={{
                          borderColor: "var(--glass-border)",
                          background: "rgba(255,255,255,0.7)",
                        }}
                      >
                        <div className="flex items-center gap-2 text-[11px] font-semibold text-[var(--muted)]">
                          {Icon && <Icon size={14} className="opacity-80" />}
                          {label}
                        </div>
                        <div className="text-[13px] font-semibold text-[var(--ink)] text-right">
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex flex-col min-[480px]:flex-row gap-2.5">
                  <button
                    type="button"
                    className="stark-btn flex-1 min-w-0 gap-2 justify-center px-3 py-3 text-[13px] font-semibold whitespace-normal md:whitespace-nowrap"
                  >
                    <Phone size={14} className="flex-shrink-0" />
                    <span data-t="callEmergencyContact">{t.callEmergencyContact}</span>
                  </button>
                  <button
                    type="button"
                    className="ghost-btn flex-1 min-w-0 gap-2 justify-center px-3 py-3 text-[13px] font-semibold whitespace-normal md:whitespace-nowrap"
                  >
                    <User size={14} className="flex-shrink-0" />
                    <span data-t="previewCallSelf">{t.previewCallSelf || "Call personal number"}</span>
                  </button>
                </div>
              </div>
            </GlassCard>

            {/* Right Card: Medical Details */}
            <GlassCard className="p-4 sm:p-7">
              <div className="flex items-center gap-2 text-[12px] font-semibold text-[var(--muted)]">
                <Stethoscope size={14} className="text-[var(--accent)]" />
                <span data-t="medicalDetails">{t.medicalDetails}</span>
              </div>

              <div className="mt-3 grid gap-2">
                {criticalItems.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[14px] border p-2.5"
                    style={{
                      borderColor: item.danger
                        ? "rgba(225, 29, 72, 0.2)"
                        : "var(--glass-border)",
                      background: item.danger
                        ? "rgba(255, 241, 242, 0.7)"
                        : "rgba(255,255,255,0.7)",
                    }}
                  >
                    <div className="text-[11px] font-semibold text-[var(--muted)]">
                      {item.label}
                    </div>
                    <div className="mt-1 text-[13px] font-semibold text-[var(--ink)]">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 rounded-[14px] border border-dashed border-[var(--line)] bg-white/60 p-3">
                <div className="flex items-center gap-2 text-[12px] font-semibold text-[var(--muted)]">
                  <FileText size={14} />
                  <span data-t="instructions">{t.instructions}</span>
                </div>
                <p className="mt-2 text-[13px] text-[var(--ink)] leading-relaxed">
                  {previewUser.notes}
                </p>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PreviewProfile;


