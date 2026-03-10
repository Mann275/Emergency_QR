import { useLocation, Link, useParams } from 'react-router-dom';
import { Download, Smartphone, ArrowRight, ExternalLink, QrCode, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Success = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const location = useLocation();
  const { qrCode, profileUrl } = location.state || {};

  if (!qrCode) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Link to="/" className="stark-btn">
          {t.returnHome}
        </Link>
      </div>
    );
  }

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `emergency-qr-${id || 'profile'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="pb-20">
      <section className="pt-28 sm:pt-36">
        <div className="main-wrap max-w-5xl">
          <div className="grid gap-6 lg:grid-cols-[0.9fr,1.1fr] items-center">
            <div className="glass-card p-6 sm:p-8 lg:p-10 animate-slide">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-slate-600">
                <ShieldCheck size={14} className="text-[var(--accent)]" />
                Profile live
              </div>
              <h1 className="mt-6 text-3xl sm:text-5xl font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-heading)', lineHeight: '1.02' }}>
                {t.profileActive}
              </h1>
              <p className="mt-4 text-base leading-relaxed text-[var(--muted)]">
                {t.passLive}
              </p>

              <div className="mt-8 space-y-4">
                <div className="rounded-[22px] border border-white/70 bg-white/55 p-4">
                  <div className="flex items-start gap-3">
                    <Download size={18} className="mt-0.5 text-[var(--accent)]" />
                    <div>
                      <div className="text-sm font-semibold text-[var(--ink)]">{t.saveCard}</div>
                      <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{t.saveDesc}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[22px] border border-white/70 bg-white/55 p-4">
                  <div className="flex items-start gap-3">
                    <Smartphone size={18} className="mt-0.5 text-[var(--accent)]" />
                    <div>
                      <div className="text-sm font-semibold text-[var(--ink)]">{t.lockScreen}</div>
                      <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{t.lockDesc}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button onClick={handleDownload} className="stark-btn gap-2">
                  <Download size={15} />
                  {t.downloadQr}
                </button>
                <a href={profileUrl} target="_blank" rel="noreferrer" className="ghost-btn gap-2">
                  {t.viewProfile}
                  <ExternalLink size={15} />
                </a>
              </div>
            </div>

            <div className="glass-card p-6 sm:p-8 animate-slide" style={{ animationDelay: '0.08s' }}>
              <div className="rounded-[28px] border border-white/75 bg-[rgba(255,255,255,0.82)] p-5 sm:p-8 shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Emergency pass</div>
                    <div className="mt-1 text-xl font-semibold text-[var(--ink)]" style={{ fontFamily: 'var(--font-heading)' }}>Ready to share</div>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-[var(--accent)]">
                    <QrCode size={22} />
                  </div>
                </div>

                <div className="mt-6 overflow-hidden rounded-[28px] bg-white p-4 sm:p-6 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.18)]">
                  <img src={qrCode} alt="Emergency QR" className="mx-auto w-full max-w-[320px]" />
                </div>

                <div className="mt-6 rounded-[22px] border border-dashed border-[var(--line)] px-4 py-4 text-center">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Best use</div>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                    Keep this on your lock screen, wallet card, or medical ID so a scanner can reach the emergency page immediately.
                  </p>
                </div>

                <Link to="/" className="mt-6 inline-flex items-center gap-2 text-base font-semibold text-[var(--accent)]">
                  {t.backToDashboard}
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Success;
