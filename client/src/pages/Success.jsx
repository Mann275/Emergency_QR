import { useEffect, useState } from "react";
import { Navigate, useLocation, Link, useParams } from "react-router-dom";
import QRCode from "qrcode";
import { Download, Smartphone, ExternalLink, QrCode } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

const Success = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const { user, loading } = useAuth();
  const location = useLocation();
  const { qrCode, profileUrl } = location.state || {};
  const defaultProfileUrl = id
    ? `${window.location.origin}/emergency/${id}`
    : "";

  const [resolvedQrCode, setResolvedQrCode] = useState(qrCode || "");
  const [resolvedProfileUrl, setResolvedProfileUrl] = useState(
    profileUrl || defaultProfileUrl,
  );
  const [isPreparingQr, setIsPreparingQr] = useState(Boolean(id) && !qrCode);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    if (qrCode) {
      setResolvedQrCode(qrCode);
      setResolvedProfileUrl(profileUrl || defaultProfileUrl);
      setIsPreparingQr(false);
      return;
    }

    if (!id) {
      setIsPreparingQr(false);
      return;
    }

    let active = true;
    const emergencyUrl = `${window.location.origin}/emergency/${id}`;
    setResolvedProfileUrl(emergencyUrl);

    const buildQr = async () => {
      try {
        const dataUrl = await QRCode.toDataURL(emergencyUrl, {
          width: 320,
          margin: 1,
        });
        if (active) {
          setResolvedQrCode(dataUrl);
        }
      } finally {
        if (active) {
          setIsPreparingQr(false);
        }
      }
    };

    buildQr();

    return () => {
      active = false;
    };
  }, [id, qrCode, profileUrl, defaultProfileUrl]);

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

  if (!user) {
    return (
      <Navigate
        to="/auth"
        replace
        state={{ redirectTo: id ? `/success/${id}` : "/create" }}
      />
    );
  }

  if (isPreparingQr) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass-card p-6 sm:p-8 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
          <p className="mt-3 text-sm font-semibold text-[var(--muted)]">
            <span data-t="qrPreparing">
              {t.qrPreparing || "Preparing your QR card..."}
            </span>
          </p>
        </div>
      </div>
    );
  }

  if (!resolvedQrCode)
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--bg)" }}
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-3 text-xs font-semibold rounded-full transition-base"
          style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
          data-t="returnHome"
        >
          {t.returnHome}
        </Link>
      </div>
    );

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = resolvedQrCode;
    link.download = `emergency-qr-${id || "profile"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <section className="pt-24 pb-20 md:pt-36 md:pb-28">
        <div className="main-wrap max-w-4xl">
          <div className="grid md:grid-cols-2 gap-24 items-center">
            <div className="animate-slide">
              <h1
                className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
                data-t="profileActive"
              >
                {t.profileActive}
              </h1>
              <p
                className="text-base leading-relaxed mb-8 opacity-70 font-medium"
                data-t="passLive"
              >
                {t.passLive}
              </p>

              <div className="space-y-6">
                <div className="flex gap-4 items-start border border-black/5 bg-white/40 p-5 rounded-2xl">
                  <Download
                    size={18}
                    className="flex-shrink-0 mt-0.5"
                    style={{ color: "var(--accent)" }}
                  />
                  <p className="text-sm leading-relaxed text-[var(--ink)]">
                    <span
                      className="font-semibold block mb-0.5 text-base"
                      data-t="saveCard"
                    >
                      {t.saveCard}
                    </span>
                    <span className="opacity-80 font-medium" data-t="saveDesc">
                      {t.saveDesc}
                    </span>
                  </p>
                </div>
                <div className="flex gap-4 items-start border border-black/5 bg-white/40 p-5 rounded-2xl">
                  <Smartphone
                    size={18}
                    className="flex-shrink-0 mt-0.5"
                    style={{ color: "var(--accent)" }}
                  />
                  <p className="text-sm leading-relaxed text-[var(--ink)]">
                    <span
                      className="font-semibold block mb-0.5 text-base"
                      data-t="lockScreen"
                    >
                      {t.lockScreen}
                    </span>
                    <span className="opacity-80 font-medium" data-t="lockDesc">
                      {t.lockDesc}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold rounded-xl transition-base shadow-lg shadow-black/5"
                  style={{
                    background: "var(--accent)",
                    color: "var(--accent-ink)",
                  }}
                  data-t="downloadQr"
                >
                  <Download size={16} /> {t.downloadQr}
                </button>
                <a
                  href={resolvedProfileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold rounded-xl border border-[var(--line)] bg-white transition-base text-[var(--ink)] hover:border-[var(--ink)]"
                  data-t="viewProfile"
                >
                  {t.viewProfile} <ExternalLink size={16} />
                </a>
              </div>
            </div>

            <div
              className="animate-slide flex flex-col items-center"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="bg-white p-6 sm:p-8 shadow-2xl rounded-3xl border border-black/20">
                <div className="flex items-center justify-between w-full mb-6">
                  <div>
                    <div
                      className="text-[10px] font-bold uppercase tracking-widest opacity-50"
                      data-t="emergencyPass"
                    >
                      {t.emergencyPass}
                    </div>
                    <div
                      className="mt-0.5 text-xl font-bold"
                      style={{ fontFamily: "var(--font-heading)" }}
                      data-t="readyToShare"
                    >
                      {t.readyToShare}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                    <QrCode size={20} />
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl w-full max-w-[320px] mx-auto">
                  <img
                    src={resolvedQrCode}
                    alt="Emergency QR"
                    className="mx-auto w-full object-contain mix-blend-multiply"
                  />
                </div>

                <div className="mt-6 border border-dashed border-[var(--line)] px-4 py-4 text-center rounded-2xl w-full bg-slate-50/50">
                  <div
                    className="text-[10px] font-bold uppercase tracking-widest opacity-50"
                    data-t="bestUse"
                  >
                    {t.bestUse}
                  </div>
                  <p
                    className="mt-1.5 text-xs font-semibold leading-relaxed opacity-80"
                    data-t="bestUseDesc"
                  >
                    {t.bestUseDesc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Success;
