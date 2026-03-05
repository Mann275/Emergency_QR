import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ApiService from "../utils/api";
import {
  Phone,
  Activity,
  FileText,
  ShieldAlert,
  User,
  ShieldCheck,
  HeartPulse,
  AlertTriangle,
  Droplet,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const EmergencyProfile = () => {
  const { id } = useParams();
  const { t } = useLanguage();
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

  if (loading)
    return (
      <div
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{ background: "var(--bg)" }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="text-center font-sans tracking-tight relative z-10">
          <HeartPulse
            size={48}
            className="mx-auto mb-6 text-red-500 animate-bounce"
          />
          <div className="text-sm font-bold opacity-30 animate-pulse tracking-widest uppercase">
            {t.retrieving}
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6 text-center relative overflow-hidden"
        style={{ background: "var(--bg)" }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-[100px]"></div>
        <div
          className="max-w-md border p-12 rounded-[2rem] relative z-10 backdrop-blur-3xl"
          style={{
            borderColor: "var(--glass-border)",
            background: "var(--glass-bg)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          }}
        >
          <ShieldAlert size={48} className="mx-auto mb-6 text-red-500/80" />
          <h1
            className="text-3xl font-bold mb-4 tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {t.accessError}
          </h1>
          <p className="text-base mb-10 opacity-50 leading-relaxed font-medium">
            {error}
          </p>
          <Link
            to="/"
            className="inline-block px-10 py-4 text-xs font-bold rounded-full transition-base uppercase tracking-widest hover:scale-105"
            style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
          >
            {t.returnHome}
          </Link>
        </div>
      </div>
    );

  const GlassCard = ({ children, className = "" }) => (
    <div
      className={`rounded-[2.5rem] overflow-hidden border transition-base ${className}`}
      style={{
        background: "var(--glass-bg)",
        borderColor: "var(--glass-border)",
        backdropFilter: "blur(30px) saturate(200%)",
        WebkitBackdropFilter: "blur(30px) saturate(200%)",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.2)",
      }}
    >
      {children}
    </div>
  );

  const SectionBadge = ({ title, icon: Icon, color = "var(--ink)" }) => (
    <div
      className=" items-center gap-2 mb-8 inline-flex px-4 py-2 rounded-full border"
      style={{
        borderColor: "var(--glass-border)",
        background: "rgba(255,255,255,0.03)",
      }}
    >
      <Icon size={14} style={{ color }} />
      <h2
        className="text-[10px] font-bold uppercase tracking-[0.25em]"
        style={{ color }}
      >
        {title}
      </h2>
    </div>
  );

  const DataGroup = ({ label, value, highlight, danger }) => (
    <div
      className={`p-5 rounded-2xl flex flex-col justify-center ${highlight ? "col-span-1 md:col-span-2" : ""}`}
      style={{
        background: danger
          ? "rgba(255, 59, 48, 0.05)"
          : "rgba(255,255,255,0.02)",
        border: "1px solid",
        borderColor: danger ? "rgba(255, 59, 48, 0.2)" : "transparent",
      }}
    >
      <span
        className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2"
        style={{ color: danger ? "var(--danger)" : "var(--ink)" }}
      >
        {label}
      </span>
      <span
        className={`text-lg md:text-xl font-medium tracking-tight ${danger ? "" : "opacity-90"}`}
        style={{
          color: danger ? "var(--danger)" : "var(--ink)",
          fontFamily: "var(--font-heading)",
        }}
      >
        {value}
      </span>
    </div>
  );

  return (
    <div
      className="min-h-screen pb-32 relative selection:bg-red-500/30"
      style={{ background: "var(--bg)" }}
    >
      {/* Background Gradients */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[120px] opacity-20 mix-blend-screen"
          style={{ background: "var(--danger)" }}
        ></div>
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full blur-[150px] opacity-10 mix-blend-screen"
          style={{ background: "var(--ink)" }}
        ></div>
      </div>

      {/* Alert Header Fixed */}
      <div
        className="fixed top-0 left-0 w-full z-50 transition-base flex items-center justify-between px-6 py-4"
        style={{
          background: "rgba(255, 59, 48, 0.9)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,0,0,0.2)",
        }}
      >
        <div className="text-[11px] font-black uppercase tracking-[0.3em] text-white flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-white animate-ping"></div>
          {t.emergencyProfile}
        </div>
        <div className="bg-black/20 px-3 py-1.5 rounded-full text-[9px] font-black text-white uppercase tracking-widest backdrop-blur-md">
          {t.active}
        </div>
      </div>

      <div className="main-wrap max-w-6xl mt-28 relative z-10">
        <div className="grid lg:grid-cols-[1.5fr,1fr] gap-8 items-start">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Main Identity Node */}
            <GlassCard className="p-8 md:p-10 relative overflow-hidden group">
              {/* Subtle accent glow inside card */}
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-base"></div>

              <SectionBadge title={t.identity} icon={User} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DataGroup label={t.fullName} value={user.name} highlight />
                <DataGroup
                  label={t.gender}
                  value={user.gender || t.notSpecified}
                />
                <DataGroup
                  label={t.dob}
                  value={
                    user.dateOfBirth
                      ? new Date(user.dateOfBirth).toLocaleDateString()
                      : "N/A"
                  }
                />

                <div
                  className="col-span-1 md:col-span-2 mt-4 p-8 rounded-3xl flex items-center justify-between border relative overflow-hidden"
                  style={{
                    borderColor: "var(--glass-border)",
                    background:
                      "linear-gradient(135deg, rgba(255, 59, 48, 0.1) 0%, rgba(0,0,0,0) 100%)",
                  }}
                >
                  <div>
                    <p className="text[10px] font-bold uppercase tracking-[0.3em] opacity-40 flex items-center gap-2 mb-2">
                      <Droplet size={14} className="text-red-500" />{" "}
                      {t.bloodGroup}
                    </p>
                    <div
                      className="text-7xl md:text-8xl font-black leading-none drop-shadow-xl"
                      style={{
                        color: "var(--danger)",
                        fontFamily: "var(--font-heading)",
                        letterSpacing: "-0.04em",
                      }}
                    >
                      {user.bloodGroup}
                    </div>
                  </div>
                  <div className="text-right">
                    <ShieldCheck
                      size={48}
                      className="opacity-10 mb-2 ml-auto"
                    />
                    <span className="text-xs font-bold uppercase tracking-widest text-[#34C759]">
                      {t.verified}
                    </span>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Medical Documentation */}
            <GlassCard className="p-8 md:p-10">
              <SectionBadge title={t.medicalDetails} icon={Activity} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <DataGroup
                  label={t.condition}
                  value={user.diseaseDetails || t.noneDisclosed}
                  danger={!!user.diseaseDetails}
                  highlight
                />
                <DataGroup
                  label={t.allergies}
                  value={user.allergies || t.noneDisclosed}
                  danger={!!user.allergies}
                  highlight
                />
                <DataGroup
                  label={t.medications}
                  value={user.medications || t.noneDisclosed}
                  highlight
                />
              </div>

              {user.notes && (
                <div
                  className="p-8 rounded-3xl border border-dashed"
                  style={{
                    borderColor: "var(--line)",
                    background: "rgba(255,255,255,0.01)",
                  }}
                >
                  <p className="text-[11px] font-black uppercase tracking-widest opacity-30 mb-6 flex items-center gap-2">
                    <FileText size={14} /> {t.instructions}
                  </p>
                  <p
                    className="text-2xl md:text-3xl font-medium leading-relaxed opacity-90 tracking-tight"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    "{user.notes}"
                  </p>
                </div>
              )}
            </GlassCard>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Emergency Contacts - Extremely Prominent */}
            <GlassCard
              className="p-8 md:p-10 border-red-500/20"
              style={{ boxShadow: "0 0 40px -10px rgba(255, 59, 48, 0.15)" }}
            >
              <SectionBadge
                title={t.emergencyContact}
                icon={AlertTriangle}
                color="var(--danger)"
              />

              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 mb-6 border border-red-500/20">
                  <HeartPulse size={32} className="text-red-500" />
                </div>
                <p
                  className="text-[10px] font-black mb-3 opacity-50 uppercase tracking-[0.3em]"
                  style={{ color: "var(--danger)" }}
                >
                  {t.primaryKin}
                </p>
                <p
                  className="text-3xl md:text-4xl font-bold mb-8 tracking-tight capitalize"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {user.emergencyContact.name}
                </p>

                <a
                  href={`tel:${user.emergencyContact.phone.replace(/\s+/g, "")}`}
                  className="group relative w-full flex items-center justify-center overflow-hidden rounded-full p-1 transition-base hover:scale-[1.02] active:scale-95 text-white"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 opacity-90 transition-opacity group-hover:opacity-100"></div>
                  <div className="absolute inset-0 bg-black/10  opacity-0 group-hover:opacity-100 transition-base"></div>
                  <div className="relative flex items-center justify-center gap-3 py-6 px-8 w-full">
                    <Phone size={20} className="animate-pulse" />
                    <span className="text-sm font-bold uppercase tracking-widest">
                      {t.callContact}
                    </span>
                  </div>
                </a>
                <p className="text-base mt-6 font-medium opacity-60 font-mono tracking-wider">
                  {user.emergencyContact.phone}
                </p>
              </div>

              <div
                className="pt-6 border-t flex flex-col items-center justify-center gap-2"
                style={{ borderColor: "var(--line)" }}
              >
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-30">
                  {t.backupConnection}
                </p>
                <a
                  href={`tel:${user.phone.replace(/\s+/g, "")}`}
                  className="text-base font-medium flex items-center justify-center gap-2 opacity-60 hover:opacity-100 transition-base group"
                >
                  <User
                    size={14}
                    className="group-hover:text-red-500 transition-colors"
                  />{" "}
                  {user.phone}
                </a>
              </div>
            </GlassCard>

            {/* Scan Log / Meta */}
            <div
              className="p-8 rounded-[2.5rem] border opacity-60 hover:opacity-100 transition-base"
              style={{ borderColor: "var(--line)", background: "transparent" }}
            >
              <div className="flex items-center gap-3 opacity-40 mb-6">
                <ShieldCheck size={16} />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                  {t.verifiedLog}
                </span>
              </div>
              <p className="text-xs font-medium leading-relaxed opacity-50 mb-8">
                {t.clinicalDisclaimer}
              </p>
              <div className="flex justify-between items-center opacity-30 font-mono text-[9px] uppercase tracking-widest">
                <span>REF: {user._id?.substring(0, 8)}</span>
                <span className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-current rounded-full"></div>{" "}
                  SECURE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyProfile;
