import { Link } from 'react-router-dom';
import { ScanLine, QrCode, Smartphone, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div>
      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="main-wrap">
          <div className="animate-slide max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-10" style={{ fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
              Critical details.<br />
              Before you can explain them.
            </h1>
            <div className="flex flex-wrap gap-4">
              <Link to="/create" className="inline-flex items-center gap-2 px-8 py-3 text-xs font-semibold rounded-full transition-base" style={{ background: 'var(--accent)', color: 'var(--accent-ink)' }}>
                Create your profile <ArrowRight size={14} />
              </Link>
              <a href="#how" className="inline-flex items-center gap-2 px-8 py-3 text-xs font-semibold rounded-full border transition-base" style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}>
                How it works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 md:py-28">
        <div className="main-wrap">
          <div className="grid md:grid-cols-3 gap-12 md:gap-16">
            <div className="animate-slide" style={{ animationDelay: '0.05s' }}>
              <ScanLine size={28} className="mb-6 opacity-60" />
              <h3 className="text-xl font-semibold mb-4 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>Fill your profile</h3>
              <p className="text-base leading-relaxed opacity-80">Blood group, allergies, medications, and emergency contacts. Nothing else.</p>
            </div>
            <div className="animate-slide" style={{ animationDelay: '0.1s' }}>
              <QrCode size={28} className="mb-6 opacity-60" />
              <h3 className="text-xl font-semibold mb-4 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>Get your QR</h3>
              <p className="text-base leading-relaxed opacity-80">A clean, high-contrast QR code. Put it on your lock screen or your ID card.</p>
            </div>
            <div className="animate-slide" style={{ animationDelay: '0.15s' }}>
              <Smartphone size={28} className="mb-6 opacity-60" />
              <h3 className="text-xl font-semibold mb-4 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>Anyone can scan</h3>
              <p className="text-base leading-relaxed opacity-80">No app needed. Any phone camera opens your critical data in one glance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 text-center">
        <div className="main-wrap">
          <div className="animate-slide" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-2xl md:text-4xl font-semibold tracking-tight mb-8" style={{ fontFamily: 'var(--font-heading)' }}>
              Ready in under two minutes.
            </h2>
            <Link to="/create" className="inline-flex items-center gap-2 px-10 py-3.5 text-xs font-semibold rounded-full transition-base" style={{ background: 'var(--accent)', color: 'var(--accent-ink)' }}>
              Get started <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
