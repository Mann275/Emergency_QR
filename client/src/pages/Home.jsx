import { Link } from 'react-router-dom';
import { ScanLine, QrCode, Smartphone, ArrowRight, User, Droplets, ShieldCheck, CheckCircle2, Heart, Clock, Globe, AlertCircle, Phone, Pill, Activity, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Home = () => {
  const { t, lang } = useLanguage();

  const DotGrid = () => (
    <div className="absolute inset-0 z-[-1] opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
      style={{ backgroundImage: 'radial-gradient(var(--ink) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
    </div>
  );

  return (
    <div className="overflow-hidden selection:bg-accent selection:text-accent-ink bg-bg">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center pt-24 pb-12 md:pt-32 md:pb-16">
        <DotGrid />

        <div className="main-wrap relative">
          <div className="max-w-4xl space-y-10">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.1] animate-slide" style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}>
                {t.heroTitle.split('. ')[0]}.<br />
                <span>{t.heroTitle.split('. ')[1]}</span>
              </h1>
              <p className="text-base md:text-xl font-bold max-w-xl leading-relaxed animate-slide" style={{ animationDelay: '0.1s', color: 'var(--ink)' }}>
                Your critical medical data, accessible in a single scan. No apps, no friction—just life-saving information when it matters most.
              </p>
            </div>

            <div className="flex flex-wrap gap-5 pt-2 animate-slide" style={{ animationDelay: '0.2s' }}>
              <Link to="/create" className="group inline-flex items-center gap-4 text-lg font-normal transition-all duration-300 active:scale-95" style={{ color: 'var(--ink)' }}>
                <span>{t.heroCta}</span>
                <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid - Compact High-Contrast */}
      <section id="how" className="relative py-8 md:py-16">
        <DotGrid />
        <div className="main-wrap">
          <div className="grid lg:grid-cols-12 gap-px bg-line border border-line">

            {/* Box 1: Setup */}
            <div className="lg:col-span-8 bg-surface p-8 flex flex-col justify-between overflow-hidden relative min-h-[350px]">
              <div className="space-y-3 relative z-10">
                <div className="text-[10px] font-black mb-1" style={{ color: 'var(--ink)' }}>01. Integration</div>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight" style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}>{t.step1Title}</h2>
                <p className="text-sm font-bold max-w-sm" style={{ color: 'var(--ink)' }}>{t.step1Desc}</p>
              </div>

              <div className="relative z-10 mt-6 bg-bg border border-line p-6 shadow-2xl space-y-6 max-w-sm">
                <div className="flex items-center justify-between border-b border-line pb-4">
                  <div className="flex items-center gap-2">
                    <Activity size={14} className="text-red-500" />
                    <span className="text-[9px] font-black" style={{ color: 'var(--ink)' }}>Record #8821</span>
                  </div>
                  <CheckCircle2 size={12} className="text-red-500" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[8px] font-black block" style={{ color: 'var(--ink)' }}>Name</label>
                    <div className="h-8 border-b border-line flex items-center text-[11px] font-black" style={{ color: 'var(--ink)' }}>Jane Williams</div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-black block" style={{ color: 'var(--ink)' }}>Blood</label>
                    <div className="h-8 border-b border-line flex items-center text-[11px] font-black text-red-500">AB+</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Box 2: QR */}
            <div className="lg:col-span-4 bg-accent p-8 flex flex-col items-center justify-center text-accent-ink relative overflow-hidden min-h-[350px]">
              <div className="relative z-10 flex flex-col items-center gap-8">
                <div className="p-6 bg-accent-ink border border-accent-ink">
                  <QrCode size={120} strokeWidth={1} className="text-accent" />
                </div>
                <div className="text-center space-y-1">
                  <div className="text-[10px] font-black mb-1">02. Generation</div>
                  <div className="text-2xl font-black tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>Unique QR</div>
                </div>
              </div>
            </div>

            {/* Box 3: Device Profile */}
            <div className="lg:col-span-4 flex flex-col items-center justify-end bg-surface overflow-hidden pt-8 border-t lg:border-t-0 lg:border-r border-line min-h-[400px]">
              <div className="relative border-[8px] border-ink w-[220px] h-[360px] bg-bg flex flex-col overflow-hidden shadow-2xl mb-[-40px]">
                <div className="h-[70px] bg-red-600 flex flex-col items-center justify-center p-4">
                  <ShieldCheck size={20} className="text-white mb-1" />
                  <div className="text-[8px] font-black text-white">Verified Medical ID</div>
                </div>
                <div className="p-4 space-y-6 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-surfaceRaised border border-line" />
                    <div className="space-y-1 flex-1">
                      <div className="h-3 w-full bg-ink" />
                      <div className="h-2 w-2/3 bg-line" />
                    </div>
                  </div>
                  <div className="space-y-3 py-4 border-t border-line">
                    <div className="text-[8px] font-black flex items-center gap-2" style={{ color: 'var(--ink)' }}>
                      <Phone size={10} className="text-red-500" /> Contact
                    </div>
                    <div className="text-[10px] font-black" style={{ color: 'var(--ink)' }}>+1 555-010-888</div>
                  </div>
                  <div className="space-y-3">
                    <div className="text-[8px] font-black flex items-center gap-2" style={{ color: 'var(--ink)' }}>
                      <Pill size={10} className="text-red-500" /> Medications
                    </div>
                    <div className="flex gap-2">
                      <div className="px-2 py-1 bg-ink text-bg text-[7px] font-black">Type A</div>
                      <div className="px-2 py-1 bg-surface-raised border border-line text-[7px] font-black" style={{ color: 'var(--ink)' }}>Asthma</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Box 4: Performance */}
            <div className="lg:col-span-8 p-10 grid md:grid-cols-2 gap-12 bg-surface">
              <div className="space-y-6 flex flex-col justify-center">
                <div className="text-[10px] font-black" style={{ color: 'var(--ink)' }}>03. Performance</div>
                <h3 className="text-3xl md:text-3xl font-black tracking-tight leading-none" style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}>{t.step3Title}</h3>
                <p className="text-base font-bold leading-relaxed" style={{ color: 'var(--ink)' }}>{t.step3Desc}</p>
              </div>
              <div className="grid grid-cols-2 gap-px bg-line border border-line">
                {[
                  { icon: <Clock size={20} />, label: 'Instant' },
                  { icon: <Globe size={20} />, label: 'Standard' },
                  { icon: <MapPin size={20} />, label: 'Location' },
                  { icon: <ShieldCheck size={20} />, label: 'Secure' }
                ].map((item, idx) => (
                  <div key={idx} className="p-6 bg-bg flex flex-col justify-between items-start h-32" style={{ color: 'var(--ink)' }}>
                    <div className="text-red-600">{item.icon}</div>
                    <div className="text-[10px] font-black mt-4">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 md:py-32 text-center">
        <DotGrid />
        <div className="main-wrap relative z-10">
          <div className="animate-slide max-w-3xl mx-auto space-y-12">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight" style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}>
              {t.readyTitle}
            </h2>
            <Link to="/create" className="group inline-flex items-center gap-8 text-xl font-normal transition-all duration-300 active:scale-95" style={{ color: 'var(--ink)' }}>
              <span>{t.getStarted}</span>
              <ArrowRight size={28} className="group-hover:translate-x-3 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
