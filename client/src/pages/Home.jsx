import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  QrCode,
  HeartPulse,
  Phone,
  Activity,
  ScanLine,
  Clock3,
  UserPlus,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const Home = () => {
  const { t } = useLanguage();

  const featureCards = [
    {
      title: t.feature1Title,
      copy: t.feature1Copy,
      icon: ScanLine,
    },
    {
      title: t.feature2Title,
      copy: t.feature2Copy,
      icon: Phone,
    },
    {
      title: t.feature3Title,
      copy: t.feature3Copy,
      icon: HeartPulse,
    },
  ];

  return (
    <div className="overflow-hidden pb-4 sm:pb-8">
      <section className="relative pt-28 sm:pt-40 pb-12 sm:pb-24">
        {/* Decorative background blur */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-100/50 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

        <div className="main-wrap">
          <div className="grid gap-12 lg:grid-cols-[1fr,1fr] items-center">

            {/* Hero Left Content */}
            <div className="animate-slide space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[var(--accent)] backdrop-blur-md shadow-sm">
                <ShieldCheck size={16} />
                {t.heroBadge}
              </div>

              <h1
                className="max-w-2xl text-5xl sm:text-6xl lg:text-[76px] font-bold tracking-tight text-[var(--ink)]"
                style={{
                  fontFamily: "var(--font-heading)",
                  lineHeight: "0.95",
                }}
              >
                {t.heroTitle}
              </h1>

              <p className="max-w-xl text-lg sm:text-xl leading-relaxed text-[var(--muted)] opacity-90 font-medium">
                {t.heroSubDesc}
              </p>

              <div className="flex flex-col sm:flex-row gap-5 pt-4">
                <Link to="/create" className="stark-btn gap-3 py-4 px-8 text-base shadow-lg shadow-black/5 hover:-translate-y-1 transition-transform">
                  {t.heroCta}
                  <ArrowRight size={18} />
                </Link>
                <a href="#preview" className="ghost-btn py-4 px-8 text-base bg-white/50 hover:bg-white text-[var(--ink)] border border-[var(--line)]">
                  {t.seePreview}
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-[var(--line)]/60">
                {[
                  [t.stat1Val, t.stat1Lbl],
                  [t.stat2Val, t.stat2Lbl],
                  [t.stat3Val, t.stat3Lbl],
                ].map(([value, label], idx) => (
                  <div key={label} className="animate-slide" style={{ animationDelay: `${0.1 + idx * 0.1}s` }}>
                    <div
                      className="text-3xl font-black text-[var(--ink)]"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {value}
                    </div>
                    <div className="mt-1.5 text-xs uppercase tracking-widest font-bold text-slate-500">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Right Graphic - illustration1.png */}
            <div className="animate-slide flex items-center justify-center lg:justify-end" style={{ animationDelay: "0.15s" }}>
              <div className="relative w-full max-w-[585px]">
                <div className="absolute inset-0 bg-white/60 blur-3xl rounded-full scale-110 -z-10"></div>
                <img
                  src="/images/img.png"
                  alt="Medical ID Concept"
                  className="relative z-10 w-full object-contain mix-blend-multiply"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      <section id="preview" className="py-16 sm:py-32 relative">
        <div className="main-wrap">

          <div className="mb-20 text-center max-w-2xl mx-auto">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[var(--ink)] tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
              A clinical approach to emergency data.
            </h2>
          </div>

          <div className="grid gap-16 lg:gap-24 lg:grid-cols-2 items-center">

            {/* Left side: Feature List (No BG cards) */}
            <div className="space-y-12 animate-slide" style={{ animationDelay: '0.12s' }}>
              {featureCards.map((feature, idx) => (
                <div key={idx} className="flex gap-4 items-start group">
                  <div className="flex shrink-0 w-12 pt-1.5 items-center justify-center text-[var(--accent)]">
                    <feature.icon size={26} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[var(--ink)] mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                      {feature.title}
                    </h3>
                    <p className="text-lg leading-relaxed text-slate-500 font-medium">
                      {feature.copy}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right side: Giant Illustration 2 */}
            <div className="flex items-center justify-center relative animate-slide" style={{ animationDelay: '0.15s' }}>
              <div className="absolute inset-0 bg-[var(--accent)]/5 blur-[100px] rounded-full -z-10"></div>
              <img
                src="/images/illustration2.png"
                alt="Emergency Network Illustration"
                className="w-full max-w-[500px] mix-blend-multiply drop-shadow-sm"
              />
            </div>

          </div>

          {/* Fast Setup Block (No Title, just steps + illustration 1) */}
          <div className="mt-24 sm:mt-40 relative">
            <div className="grid gap-16 lg:grid-cols-[1.1fr,0.9fr] items-center">
              <div className="order-2 lg:order-1 flex justify-center relative">
                <div className="absolute inset-0 bg-[#06b6d4]/5 blur-[100px] rounded-full -z-10"></div>
                <img
                  src="/images/illustration1.png"
                  alt="Fast workflow"
                  className="w-full max-w-[550px] mix-blend-multiply"
                />
              </div>

              <div className="order-1 lg:order-2 space-y-10">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--ink)]">
                  {t.fastSetupBadge}
                </div>

                {/* Fast Setup Title removed per request */}

                <div className="space-y-10">
                  {[
                    [UserPlus, t.step1Title, t.step1Desc],
                    [
                      QrCode,
                      t.step2Title || "Get your QR",
                      t.step2Desc || "Download a clear QR card for quick access.",
                    ],
                    [ShieldCheck, t.step3Title, t.step3Desc],
                  ].map(([Icon, title, copy]) => (
                    <div key={title} className="flex gap-4 items-start">
                      <div className="flex w-12 shrink-0 pt-1.5 items-center justify-center text-[var(--accent)]">
                        <Icon size={26} strokeWidth={1.5} />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-[var(--ink)] mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                          {title}
                        </div>
                        <p className="text-lg leading-relaxed text-slate-500 font-medium">
                          {copy}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
