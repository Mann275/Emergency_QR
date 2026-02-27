import { Link } from 'react-router-dom';
import { ScanLine, QrCode, Smartphone, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Home = () => {
  const { t } = useLanguage();

  return (
    <div>
      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="main-wrap">
          <div className="animate-slide max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-10" style={{ fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
              {t.heroTitle.split('. ')[0]}.<br />
              {t.heroTitle.split('. ')[1]}
            </h1>
            <div className="flex flex-wrap gap-4">
              <Link to="/create" className="inline-flex items-center gap-2 px-8 py-3 text-xs font-semibold rounded-full transition-base" style={{ background: 'var(--accent)', color: 'var(--accent-ink)' }}>
                {t.heroCta} <ArrowRight size={14} />
              </Link>
              <a href="#how" className="inline-flex items-center gap-2 px-8 py-3 text-xs font-semibold rounded-full border transition-base" style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}>
                {t.howItWorks}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How it works - Interactive Mockups */}
      <section id="how" className="py-20 md:py-32 bg-black/5 dark:bg-white/[0.02]">
        <div className="main-wrap">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
              See How It Actually Works
            </h2>
            <p className="text-base md:text-lg opacity-60 max-w-2xl mx-auto">
              A seamless flow from generating your QR code to first responders accessing your life-saving medical data instantly.
            </p>
          </div>

          <div className="space-y-24 md:space-y-40">
            {/* Step 1: Create Profile */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 space-y-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold bg-black text-white dark:bg-white dark:text-black">1</div>
                <h3 className="text-2xl md:text-4xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>{t.step1Title}</h3>
                <p className="text-base md:text-lg opacity-60 leading-relaxed">{t.step1Desc}</p>

                <div className="p-6 rounded-2xl border bg-white dark:bg-black max-w-sm mt-8 shadow-xl" style={{ borderColor: 'var(--line)' }}>
                  <div className="space-y-4 opacity-50 pointer-events-none grayscale">
                    <div className="h-4 w-24 bg-current rounded"></div>
                    <div className="h-10 w-full border rounded-xl flex items-center px-4" style={{ borderColor: 'var(--line)' }}>John Doe</div>
                    <div className="h-4 w-32 bg-current rounded mt-4"></div>
                    <div className="h-10 w-full border rounded-xl flex items-center px-4" style={{ borderColor: 'var(--line)' }}>AB- Negative</div>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2 flex justify-center md:justify-end">
                <ScanLine size={120} className="opacity-10 dark:opacity-20" />
              </div>
            </div>

            {/* Step 2: Generate QR */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="flex justify-center md:justify-start">
                <div className="relative p-8 bg-white rounded-[2rem] shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="absolute -top-4 -right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-bounce">Ready!</div>
                  <QrCode size={180} color="#000" />
                </div>
              </div>
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold bg-black text-white dark:bg-white dark:text-black">2</div>
                <h3 className="text-2xl md:text-4xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>{t.step2Title}</h3>
                <p className="text-base md:text-lg opacity-60 leading-relaxed">{t.step2Desc}</p>
              </div>
            </div>

            {/* Step 3: Instant Access */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 space-y-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold bg-black text-white dark:bg-white dark:text-black">3</div>
                <h3 className="text-2xl md:text-4xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>{t.step3Title}</h3>
                <p className="text-base md:text-lg opacity-60 leading-relaxed">{t.step3Desc}</p>
              </div>
              <div className="order-1 md:order-2 flex justify-center md:justify-end">
                <div className="relative border-[8px] border-black dark:border-white rounded-[3rem] w-64 h-[500px] overflow-hidden bg-white shadow-2xl -rotate-2 hover:rotate-0 transition-all duration-500">
                  <div className="absolute top-0 w-full h-6 bg-black dark:bg-white rounded-b-xl max-w-[120px] left-1/2 -translate-x-1/2 z-10"></div>
                  <div className="p-4 bg-red-500 text-white text-[10px] font-black tracking-widest text-center pt-8">EMERGENCY PROFILE</div>
                  <div className="p-4 space-y-4">
                    <div className="flex justify-between items-end border-b pb-4">
                      <div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase">Patient</div>
                        <div className="text-lg font-bold text-black" style={{ fontFamily: 'var(--font-heading)' }}>John Doe</div>
                      </div>
                      <div className="text-red-500 font-black text-3xl">AB-</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Emergency Contact</div>
                      <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
                        📞 +1 234 567 890
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Allergies</div>
                      <div className="text-sm font-bold text-gray-800">Penicillin, Peanuts</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 text-center">
        <div className="main-wrap">
          <div className="animate-slide" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-2xl md:text-4xl font-semibold tracking-tight mb-8" style={{ fontFamily: 'var(--font-heading)' }}>
              {t.readyTitle}
            </h2>
            <Link to="/create" className="inline-flex items-center gap-2 px-10 py-3.5 text-xs font-semibold rounded-full transition-base" style={{ background: 'var(--accent)', color: 'var(--accent-ink)' }}>
              {t.getStarted} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
