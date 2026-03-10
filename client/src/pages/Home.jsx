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
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const featureCards = [
  {
    title: "Scan once",
    copy: "Responders land directly on the emergency profile without any app install or login.",
    icon: ScanLine,
  },
  {
    title: "Call fast",
    copy: "Primary contact and backup number are visible above the fold for immediate action.",
    icon: Phone,
  },
  {
    title: "Medical first",
    copy: "Blood group, allergies, medications, and notes are prioritized for real emergency use.",
    icon: HeartPulse,
  },
];

const Home = () => {
  const { t } = useLanguage();

  return (
    <div className="overflow-hidden pb-16 sm:pb-24">
      <section className="relative pt-28 sm:pt-36 pb-12 sm:pb-20">
        <div className="main-wrap">
          <div className="grid gap-8 lg:grid-cols-[1.15fr,0.85fr] items-center">
            <div className="animate-slide">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-slate-600 backdrop-blur-xl">
                <ShieldCheck size={14} className="text-[var(--accent)]" />
                Emergency access card
              </div>

              <h1
                className="mt-6 max-w-3xl text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-[var(--ink)]"
                style={{
                  fontFamily: "var(--font-heading)",
                  lineHeight: "0.96",
                }}
              >
                {t.heroTitle}
              </h1>

              <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-[var(--muted)]">
                Emergency QR stores the details that matter in a calm, readable
                profile. One scan reveals blood group, emergency contact,
                medical notes, and responder instructions instantly.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link to="/create" className="stark-btn gap-3">
                  {t.heroCta}
                  <ArrowRight size={16} />
                </Link>
                <a href="#preview" className="ghost-btn">
                  See preview
                </a>
              </div>

              <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  ["10 sec", "scan to action"],
                  ["1 page", "clear emergency view"],
                  ["0 app", "camera only access"],
                ].map(([value, label]) => (
                  <div key={label} className="glass-panel p-5">
                    <div
                      className="text-2xl font-bold text-[var(--ink)]"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {value}
                    </div>
                    <div className="mt-1 text-sm text-[var(--muted)]">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="animate-slide" style={{ animationDelay: "0.08s" }}>
              <div className="glass-card p-5 sm:p-7">
                <div className="rounded-[26px] border border-white/70 bg-[rgba(255,255,255,0.76)] p-4 sm:p-5 shadow-[0_18px_45px_rgba(15,23,42,0.1)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                        Live emergency card
                      </div>
                      <div
                        className="mt-1 text-xl font-semibold text-[var(--ink)]"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        Lock-screen ready
                      </div>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-[var(--accent)]">
                      <QrCode size={22} />
                    </div>
                  </div>

                  <div className="mt-5 rounded-[24px] bg-[linear-gradient(135deg,rgba(255,255,255,0.9),rgba(236,253,245,0.88))] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                          Emergency profile
                        </div>
                        <div
                          className="mt-2 text-3xl font-bold text-[var(--ink)]"
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          Patel Mann
                        </div>
                      </div>
                      <div className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-rose-600">
                        AB+
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3">
                      <div className="glass-panel p-4 bg-white/70">
                        <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                          Primary contact
                        </div>
                        <div className="mt-2 text-lg font-semibold text-[var(--ink)]">
                          +91 79901 26127
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="glass-panel p-4 bg-white/70">
                          <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                            Allergy
                          </div>
                          <div className="mt-2 text-sm font-semibold text-rose-600">
                            None
                          </div>
                        </div>
                        <div className="glass-panel p-4 bg-white/70">
                          <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                            Medication
                          </div>
                          <div className="mt-2 text-sm font-semibold text-[var(--ink)]">
                            Pyaar ki Kami
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between rounded-[22px] border border-dashed border-[var(--line)] px-4 py-3 text-sm text-[var(--muted)]">
                    <span>Readable in one glance</span>
                    <span className="font-semibold text-[var(--accent)]">
                      Responder-first
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="preview" className="py-8 sm:py-12">
        <div className="main-wrap">
          <div className="grid gap-5 lg:grid-cols-3">
            {featureCards.map(({ title, copy, icon: Icon }, index) => (
              <div
                key={title}
                className="glass-card p-6 sm:p-7 animate-slide"
                style={{ animationDelay: `${0.12 + index * 0.05}s` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70 text-[var(--accent)] shadow-[0_12px_24px_rgba(60,22,34,0.06)]">
                  <Icon size={20} />
                </div>
                <h2
                  className="mt-5 text-2xl font-semibold text-[var(--ink)]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {title}
                </h2>
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-[var(--muted)]">
                  {copy}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 glass-card p-6 sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[0.9fr,1.1fr] items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-slate-600">
                  <Clock3 size={14} className="text-[var(--accent)]" />
                  Fast setup
                </div>
                <h2
                  className="mt-5 text-3xl sm:text-4xl font-bold text-[var(--ink)]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Build the pass in under two minutes.
                </h2>
                <p className="mt-4 text-base leading-relaxed text-[var(--muted)]">
                  Create the profile once, download the QR, and keep it on your
                  phone, wallet card, or lock screen. The public page only shows
                  emergency-safe details.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  [Activity, t.step1Title, t.step1Desc],
                  [
                    QrCode,
                    t.step2Title || "Get your QR",
                    t.step2Desc || "Download a clear QR card for quick access.",
                  ],
                  [ShieldCheck, t.step3Title, t.step3Desc],
                ].map(([Icon, title, copy]) => (
                  <div
                    key={title}
                    className="rounded-[24px] border border-white/70 bg-white/62 p-5 backdrop-blur-xl"
                  >
                    <Icon size={18} className="text-[var(--accent)]" />
                    <div
                      className="mt-4 text-lg font-semibold text-[var(--ink)]"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {title}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                      {copy}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
