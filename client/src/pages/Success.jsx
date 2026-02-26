import { useLocation, Link } from 'react-router-dom';
import { Download, Smartphone, ArrowRight, ExternalLink, QrCode } from 'lucide-react';

const Success = () => {
  const location = useLocation();
  const { qrCode, profileUrl } = location.state || {};

  if (!qrCode) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <Link to="/" className="inline-flex items-center gap-2 px-8 py-3 text-xs font-semibold rounded-full transition-base" style={{ background: 'var(--accent)', color: 'var(--accent-ink)' }}>
        Return Home
      </Link>
    </div>
  );

  return (
    <div>
      <section className="pt-32 pb-20 md:pt-36 md:pb-28">
        <div className="main-wrap max-w-4xl">
          <div className="grid md:grid-cols-2 gap-24 items-center">

            <div className="animate-slide">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6" style={{ fontFamily: 'var(--font-heading)' }}>Profile Active.</h1>
              <p className="text-sm leading-relaxed mb-12 opacity-60">
                Your emergency pass is live. This QR code leads directly to your medical data.
              </p>

              <div className="space-y-8">
                <div className="flex gap-4 items-start">
                  <Download size={16} className="flex-shrink-0 mt-0.5 opacity-50" />
                  <p className="text-sm leading-relaxed">
                    <span className="font-semibold block mb-1">Save the card</span>
                    Long press or right-click the QR code image to download it to your device.
                  </p>
                </div>
                <div className="flex gap-4 items-start">
                  <Smartphone size={16} className="flex-shrink-0 mt-0.5 opacity-50" />
                  <p className="text-sm leading-relaxed">
                    <span className="font-semibold block mb-1">Lock screen</span>
                    Set this as your lock screen wallpaper for instant reachability by responders.
                  </p>
                </div>
              </div>

              <div className="mt-12 flex flex-wrap gap-4">
                <Link to="/" className="inline-flex items-center gap-2 px-8 py-3 text-xs font-semibold rounded-full transition-base" style={{ background: 'var(--accent)', color: 'var(--accent-ink)' }}>
                  Finish <ArrowRight size={14} />
                </Link>
                <a href={profileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-8 py-3 text-xs font-semibold rounded-full border transition-base" style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}>
                  View Profile <ExternalLink size={14} />
                </a>
              </div>
            </div>

            <div className="animate-slide flex justify-center" style={{ animationDelay: '0.1s' }}>
              <div className="bg-white p-12 rounded-[3rem] shadow-2xl transition-base hover:scale-[1.02]">
                <img src={qrCode} alt="Emergency QR" className="w-64 h-64 md:w-80 md:h-80" />
                <div className="mt-8 text-center text-black flex flex-col items-center">
                  <QrCode size={16} className="mb-2 opacity-40" />
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] mb-1">Emergency QR</p>
                  <p className="text-[8px] font-medium opacity-40 uppercase tracking-widest">Digital Identification Pass</p>
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
