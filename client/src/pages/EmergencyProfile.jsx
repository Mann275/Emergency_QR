import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import QRCode from "qrcode";
import {
  Phone,
  User,
  Calendar,
  FileText,
  Stethoscope,
  Cake,
  VenusAndMars,
  Pencil,
  QrCode,
  ShieldAlert,
  HeartPulse,
  ShieldCheck,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import ApiService from "../utils/api";
import { showToast } from "../utils/toast.jsx";

const EmergencyProfile = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await ApiService.getUserById(id);
        if (response.success) {
          setUser(response.data);
          
          let isOwner = false;
          if (ApiService.hasEditToken(id)) {
            isOwner = true;
          } else if (authUser?.uid) {
            try {
              const ownerResp = await ApiService.getUserByOwnerAuthUid(authUser.uid);
              if (ownerResp?.data?.uniqueId === id) {
                isOwner = true;
              }
            } catch (e) {
              // ignore
            }
          }
          setCanEdit(isOwner);

        } else {
          setError(t.notFound || "Profile not found.");
        }
      } catch {
        setError(t.failedLoad || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, t.failedLoad, t.notFound, authUser?.uid]);

  const handleDownloadQr = async () => {
    try {
      const profileUrl = `${window.location.origin}/emergency/${id}`;
      const dataUrl = await QRCode.toDataURL(profileUrl, {
        width: 256,
        margin: 1,
      });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `emergency-qr-${id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast({ message: t.qrDownloaded || "QR downloaded." });
    } catch {
      showToast({
        message: t.qrGenerateFailed || "Could not generate QR right now.",
        variant: "error",
      });
    }
  };

  const GlassCard = ({ children, className = "" }) => (
    <div className={`glass-card ${className}`}>{children}</div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <GlassCard className="p-8 sm:p-10 text-center max-w-md w-full">
          <HeartPulse
            size={42}
            className="mx-auto text-[var(--accent)] animate-pulse"
          />
          <p
            className="mt-4 text-base font-semibold uppercase tracking-[0.06em] text-[var(--muted)]"
            data-t="retrieving"
          >
            {t.retrieving}
          </p>
        </GlassCard>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <GlassCard className="p-8 sm:p-10 text-center max-w-md w-full">
          <ShieldAlert size={46} className="mx-auto text-rose-600" />
          <h1
            className="mt-5 text-3xl font-bold text-[var(--ink)]"
            style={{ fontFamily: "var(--font-heading)" }}
            data-t="accessError"
          >
            {t.accessError || "Access Error"}
          </h1>
          <p className="mt-3 text-base text-[var(--muted)]">
            {error || t.notFound}
          </p>
          <Link
            to="/"
            className="stark-btn mt-8 inline-flex"
            data-t="returnHome"
          >
            {t.returnHome}
          </Link>
        </GlassCard>
      </div>
    );
  }

  const contact = user.emergencyContact || {};
  const bloodGroup = user.bloodGroup || "N/A";
  const age = user.age ? `${user.age} yrs` : "N/A";
  const dob = user.dateOfBirth
    ? new Date(user.dateOfBirth).toLocaleDateString()
    : "N/A";

  const facts = [
    {
      label: t.fullName,
      value: user.name || t.notSpecified,
      icon: User,
      key: "fullName",
    },
    {
      label: t.gender,
      value: user.gender || t.notSpecified,
      icon: VenusAndMars,
      key: "gender",
    },
    { label: t.dob, value: dob, icon: Calendar, key: "dob" },
    { label: t.age, value: age, icon: Cake, key: "age" },
  ];

  const criticalItems = [
    {
      label: t.allergies,
      value: user.allergies || t.noneDisclosed,
      danger: true,
      key: "allergies",
    },
    {
      label: t.medications,
      value: user.medications || t.noneDisclosed,
      danger: false,
      key: "medications",
    },
    {
      label: t.condition,
      value: user.diseaseDetails || t.noneDisclosed,
      danger: true,
      key: "condition",
    },
  ];

  const personalPhone = String(user.phone || "");
  const emergencyPhone = String(contact.phone || personalPhone);

  return (
    <div className="min-h-screen pb-[calc(9rem+env(safe-area-inset-bottom))] sm:pb-14">
      <section className="pt-5 sm:pt-8 lg:pt-10">
        <div className="main-wrap max-w-5xl">
          <div className="mb-6 px-3 sm:px-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
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
                    className="block text-[1.35rem] sm:text-[1.55rem] font-bold tracking-tight"
                    style={{ fontFamily: "var(--font-heading)" }}
                    data-t="brandTitle"
                  >
                    Emergency QR
                  </span>
                </span>
              </Link>

              <div className="flex items-center gap-2">
                <span
                  className="inline-flex items-center gap-1 rounded-full border border-white/70 bg-white/70 px-3 py-1.5 text-[13px] sm:text-[14px] font-semibold text-[var(--muted)]"
                  data-t="emergencyProfile"
                >
                  <ShieldCheck size={12} /> {t.emergencyProfile}
                </span>
                <span
                  className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-[13px] sm:text-[14px] font-semibold text-rose-600"
                  data-t="active"
                >
                  <HeartPulse size={12} /> {t.active}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {canEdit && (
                <>
                  <Link
                    to={`/edit/${id}`}
                    className="ghost-btn gap-2 px-4 py-2 text-[15px] sm:text-[16px]"
                    data-t="editProfile"
                  >
                    <Pencil size={14} /> {t.editProfile || "Edit profile"}
                  </Link>
                  <button
                    type="button"
                    onClick={handleDownloadQr}
                    className="ghost-btn gap-2 px-4 py-2 text-[15px] sm:text-[16px]"
                    data-t="downloadQr"
                  >
                    <QrCode size={14} /> {t.downloadQr || "Download QR"}
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2 lg:gap-8">
            <GlassCard className="p-4 sm:p-7">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[14px] sm:text-[15px] font-semibold text-[var(--muted)]">
                    <User size={14} className="text-[var(--accent)]" />
                    <span data-t="patientFacts">
                      {t.patientFacts || "User details"}
                    </span>
                  </div>

                  <div className="mt-3 grid gap-2">
                    <div
                      className="rounded-[14px] border p-3"
                      style={{
                        borderColor: "var(--glass-border)",
                        background: "rgba(255,255,255,0.7)",
                      }}
                    >
                      <div
                        className="text-[13px] sm:text-[14px] font-semibold text-[var(--muted)]"
                        data-t="bloodGroupLabel"
                      >
                        {t.bloodGroupLabel}
                      </div>
                      <div
                        className="mt-1 text-[2rem] sm:text-[2.25rem] font-black text-rose-600"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {bloodGroup}
                      </div>
                    </div>

                    {facts.map(({ label, value, icon: Icon, key }) => (
                      <div
                        key={key}
                        className="rounded-[14px] border p-3 flex items-center justify-between gap-3"
                        style={{
                          borderColor: "var(--glass-border)",
                          background: "rgba(255,255,255,0.7)",
                        }}
                      >
                        <div className="flex items-center gap-2 text-[13px] sm:text-[14px] font-semibold text-[var(--muted)]">
                          {Icon && <Icon size={14} className="opacity-80" />}
                          <span data-t={key}>{label}</span>
                        </div>
                        <div className="text-[16px] sm:text-[18px] font-semibold text-[var(--ink)] text-right">
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[16px] border border-[var(--glass-border)] bg-white/55 p-2.5">
                    <a
                      href={`tel:${emergencyPhone.replace(/\s+/g, "")}`}
                      className="stark-btn w-full min-w-0 gap-2 justify-center px-3 py-3 text-[15px] sm:text-[16px] font-semibold whitespace-normal"
                    >
                      <Phone size={15} className="flex-shrink-0" />
                      <span data-t="callEmergencyContact">
                        {t.callEmergencyContact}
                      </span>
                    </a>
                    <p className="mt-2 text-center text-[14px] sm:text-[15px] font-semibold text-[var(--muted)] break-all">
                      {emergencyPhone}
                    </p>
                  </div>

                  {personalPhone && personalPhone !== emergencyPhone && (
                    <div className="rounded-[16px] border border-[var(--glass-border)] bg-white/55 p-2.5">
                      <a
                        href={`tel:${personalPhone.replace(/\s+/g, "")}`}
                        className="ghost-btn w-full min-w-0 gap-2 justify-center px-3 py-3 text-[15px] sm:text-[16px] font-semibold whitespace-normal"
                      >
                        <User size={15} className="flex-shrink-0" />
                        <span data-t="callYourNumber">
                          {t.callYourNumber || "Call Your Number"}
                        </span>
                      </a>
                      <p className="mt-2 text-center text-[14px] sm:text-[15px] font-semibold text-[var(--muted)] break-all">
                        {personalPhone}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-4 sm:p-7">
              <div className="flex items-center gap-2 text-[14px] sm:text-[15px] font-semibold text-[var(--muted)]">
                <Stethoscope size={14} className="text-[var(--accent)]" />
                <span data-t="medicalDetails">{t.medicalDetails}</span>
              </div>

              <div className="mt-3 grid gap-2">
                {criticalItems.map((item) => (
                  <div
                    key={item.key}
                    className="rounded-[14px] border p-3"
                    style={{
                      borderColor: item.danger
                        ? "rgba(225, 29, 72, 0.2)"
                        : "var(--glass-border)",
                      background: item.danger
                        ? "rgba(255, 241, 242, 0.7)"
                        : "rgba(255,255,255,0.7)",
                    }}
                  >
                    <div className="text-[13px] sm:text-[14px] font-semibold text-[var(--muted)]">
                      <span data-t={item.key}>{item.label}</span>
                    </div>
                    <div className="mt-1 text-[16px] sm:text-[18px] font-semibold text-[var(--ink)] break-words">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              {user.notes && (
                <div className="mt-3 rounded-[14px] border border-dashed border-[var(--line)] bg-white/60 p-3">
                  <div className="flex items-center gap-2 text-[14px] sm:text-[15px] font-semibold text-[var(--muted)]">
                    <FileText size={14} />
                    <span data-t="instructions">{t.instructions}</span>
                  </div>
                  <p className="mt-2 text-[16px] sm:text-[18px] text-[var(--ink)] leading-relaxed break-words">
                    {user.notes}
                  </p>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EmergencyProfile;
