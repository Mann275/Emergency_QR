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
      titleKey: "feature1Title",
      copyKey: "feature1Copy",
    },
    {
      title: t.feature2Title,
      copy: t.feature2Copy,
      icon: Phone,
      titleKey: "feature2Title",
      copyKey: "feature2Copy",
    },
    {
      title: t.feature3Title,
      copy: t.feature3Copy,
      icon: HeartPulse,
      titleKey: "feature3Title",
      copyKey: "feature3Copy",
    },
  ];

  const stats = [
    [t.stat1Val, t.stat1Lbl, Clock3, "stat1Val", "stat1Lbl"],
    [t.stat2Val, t.stat2Lbl, QrCode, "stat2Val", "stat2Lbl"],
    [t.stat3Val, t.stat3Lbl, Activity, "stat3Val", "stat3Lbl"],
  ];

  const setupSteps = [
    [UserPlus, t.step1Title, t.step1Desc, "step1Title", "step1Desc"],
    [
      QrCode,
      t.step2Title || "Get your QR",
      t.step2Desc || "Download a clear QR card for quick access.",
      "step2Title",
      "step2Desc",
    ],
    [ShieldCheck, t.step3Title, t.step3Desc, "step3Title", "step3Desc"],
  ];

  return (
    <div className="overflow-hidden pb-4 sm:pb-8">
      <section className="relative pt-24 sm:pt-30 pb-10 sm:pb-24">
        {/* Decorative background blur */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-100/50 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

        <div className="main-wrap">
          <div className="grid gap-12 lg:grid-cols-[1fr,1fr] items-center">
            {/* Hero Left Content */}
            <div className="animate-slide space-y-7 text-center lg:text-left flex flex-col items-center lg:items-start">
              <h1
                className="max-w-2xl text-[42px] sm:text-6xl lg:text-[76px] font-bold tracking-tight text-[var(--ink)] mx-auto lg:mx-0"
                style={{
                  fontFamily: "var(--font-heading)",
                  lineHeight: "1.02",
                }}
                data-t="heroTitle"
              >
                {t.heroTitle}
              </h1>

              <p
                className="max-w-xl text-base sm:text-lg leading-relaxed text-[var(--muted)] opacity-90 font-medium mx-auto lg:mx-0"
                data-t="heroSubDesc"
              >
                {t.heroSubDesc}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-3 items-center lg:items-start justify-center lg:justify-start w-full sm:w-auto">
                <Link
                  to="/create"
                  className="stark-btn gap-3 py-4 px-8 text-base shadow-lg shadow-black/5 hover:-translate-y-1 transition-transform justify-center"
                  data-t="heroCta"
                >
                  {t.heroCta}
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/preview"
                  className="ghost-btn py-4 px-8 text-base bg-white/50 hover:bg-white text-[var(--ink)] border border-[var(--line)] justify-center"
                  data-t="seePreview"
                >
                  {t.seePreview}
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-8 border-t border-[var(--line)]/60 text-center w-full">
                {stats.map(([value, label, Icon, valueKey, labelKey], idx) => (
                  <div
                    key={label}
                    className="animate-slide rounded-2xl border border-[var(--line)]/60 bg-white/60 px-2.5 py-3"
                    style={{ animationDelay: `${0.1 + idx * 0.1}s` }}
                  >
                    <div className="mb-1 flex items-center justify-center text-[var(--accent)]">
                      <Icon size={18} strokeWidth={1.8} />
                    </div>
                    <div
                      className="text-2xl sm:text-3xl font-black text-[var(--ink)]"
                      style={{ fontFamily: "var(--font-heading)" }}
                      data-t={valueKey}
                    >
                      {value}
                    </div>
                    <div
                      className="mt-1 text-[10px] uppercase tracking-widest font-bold text-slate-500"
                      data-t={labelKey}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Right Graphic - illustration1.png */}
            <div
              className="animate-slide flex items-center justify-center lg:justify-end"
              style={{ animationDelay: "0.15s" }}
            >
              <div className="relative w-full max-w-[420px] sm:max-w-[520px] lg:max-w-[585px]">
                <div className="absolute inset-0 bg-white/60 blur-3xl rounded-full scale-110 -z-10"></div>
                <img
                  src="https://ik.imagekit.io/shubhampathak/emergency-qr/img.png"
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
          <div className="mb-14 sm:mb-20 text-center max-w-2xl mx-auto">
            <h2
              className="text-3xl sm:text-5xl lg:text-6xl font-black text-[var(--ink)] tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
              data-t="previewSectionTitle"
            >
              {t.previewSectionTitle ||
                "A clinical approach to emergency data."}
            </h2>
          </div>

          <div className="grid gap-16 lg:gap-24 lg:grid-cols-2 items-center">
            {/* Left side: Feature List (No BG cards) */}
            <div
              className="space-y-10 sm:space-y-12 animate-slide text-left"
              style={{ animationDelay: "0.12s" }}
            >
              {featureCards.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex flex-row gap-3 sm:gap-4 items-start text-left group"
                >
                  <div className="flex shrink-0 w-10 sm:w-12 pt-1 items-start justify-center text-[var(--accent)]">
                    <feature.icon size={26} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 max-w-none">
                    <h3
                      className="text-xl sm:text-2xl font-bold text-[var(--ink)] mb-2"
                      style={{ fontFamily: "var(--font-heading)" }}
                      data-t={feature.titleKey}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className="text-base sm:text-lg leading-relaxed text-slate-500 font-medium"
                      data-t={feature.copyKey}
                    >
                      {feature.copy}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right side: Giant Illustration 2 */}
            <div
              className="flex items-center justify-center relative animate-slide"
              style={{ animationDelay: "0.15s" }}
            >
              <div className="absolute inset-0 bg-[var(--accent)]/5 blur-[100px] rounded-full -z-10"></div>
              <img
                src="https://ik.imagekit.io/shubhampathak/emergency-qr/illustration2.png"
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
                  src="https://ik.imagekit.io/shubhampathak/emergency-qr/illustration1.png"
                  alt="Fast workflow"
                  className="w-full max-w-[550px] mix-blend-multiply"
                />
              </div>

              <div className="order-1 lg:order-2 space-y-8 sm:space-y-10 text-left">
                <div
                  className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[var(--ink)]"
                  data-t="fastSetupBadge"
                >
                  {t.fastSetupBadge}
                </div>

                {/* Fast Setup Title removed per request */}

                <div className="space-y-10">
                  {setupSteps.map(([Icon, title, copy, titleKey, copyKey]) => (
                    <div
                      key={title}
                      className="flex flex-row gap-3 sm:gap-4 items-start text-left"
                    >
                      <div className="flex w-10 sm:w-12 shrink-0 pt-1 items-start justify-center text-[var(--accent)]">
                        <Icon size={26} strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 max-w-none">
                        <div
                          className="text-xl sm:text-2xl font-bold text-[var(--ink)] mb-2"
                          style={{ fontFamily: "var(--font-heading)" }}
                          data-t={titleKey}
                        >
                          {title}
                        </div>
                        <p
                          className="text-base sm:text-lg leading-relaxed text-slate-500 font-medium"
                          data-t={copyKey}
                        >
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
