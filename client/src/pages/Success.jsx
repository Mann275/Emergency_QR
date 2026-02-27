import { useLocation, Link, useParams } from 'react-router-dom';
import { Download, Smartphone, ArrowRight, ExternalLink, QrCode } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Success = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const location = useLocation();
  const { qrCode, profileUrl } = location.state || {};

  if (!qrCode) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <Link to="/" className="inline-flex items-center gap-2 px-8 py-3 text-xs font-semibold rounded-full transition-base" style={{ background: 'var(--accent)', color: 'var(--accent-ink)' }}>
        {t.returnHome}
      </Link>
    </div>
  );

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `emergency-qr-${id || 'profile'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <section className="pt-32 pb-20 md:pt-36 md:pb-28">
        <div className="main-wrap max-w-4xl">
          <div className="grid md:grid-cols-2 gap-24 items-center">

            <div className="animate-slide">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6" style={{ fontFamily: 'var(--font-heading)' }}>{t.profileActive}</h1>
              <p className="text-base leading-relaxed mb-12 opacity-60">
                {t.passLive}
              </p>

              <div className="space-y-8">
                <div className="flex gap-4 items-start">
                  <Download size={18} className="flex-shrink-0 mt-0.5 opacity-50" />
                  <p className="text-base leading-relaxed">
                    <span className="font-semibold block mb-1">{t.saveCard}</span>
                    {t.saveDesc}
                  </p>
                </div>
                <div className="flex gap-4 items-start">
                  <Smartphone size={18} className="flex-shrink-0 mt-0.5 opacity-50" />
                  <p className="text-base leading-relaxed">
                    <span className="font-semibold block mb-1">{t.lockScreen}</span>
                    {t.lockDesc}
                  </p>
                </div>
              </div>

              <div className="mt-12 flex flex-wrap gap-4">
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 px-8 py-3.5 text-xs font-bold rounded-full transition-base shadow-lg shadow-black/5"
                  style={{ background: 'var(--accent)', color: 'var(--accent-ink)' }}
                >
                  <Download size={14} /> {t.downloadQr}
                </button>
                <a href={profileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-8 py-3.5 text-xs font-bold rounded-full border transition-base" style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}>
                  {t.viewProfile} <ExternalLink size={14} />
                </a>
              </div>
            </div>

            <div className="animate-slide flex flex-col items-center" style={{ animationDelay: '0.1s' }}>
              <div className="bg-white p-10 shadow-2xl" style={{ border: '1px solid var(--line)' }}>
                <img src={qrCode} alt="Emergency QR" className="w-64 h-64 md:w-80 md:h-80" />
                <div className="mt-8 text-center text-black flex flex-col items-center">
                  <QrCode size={18} className="mb-2 opacity-40" />
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] mb-1">Emergency QR</p>
                  <p className="text-[8px] font-medium opacity-40 uppercase tracking-widest">Digital Identification Pass</p>
                </div>
              </div>
              <Link to="/" className="mt-12 text-xs font-bold opacity-30 hover:opacity-100 transition-base uppercase tracking-widest flex items-center gap-2">
                {t.backToDashboard} <ArrowRight size={12} />
              </Link>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Success;
