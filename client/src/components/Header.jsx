import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Languages, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Header = () => {
  const { lang, setLang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'gu', label: 'ગુજરાતી' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = languages.find(l => l.code === lang) || languages[0];

  return (
    <header className="glass-nav px-6 py-4">
      <nav className="flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-3 text-slate-900 transition-base min-w-0">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/60 bg-white/70 shadow-[0_12px_30px_rgba(60,22,34,0.08)]">
            <img
              src="/images/logo_no_text.png"
              alt="Emergency QR Logo"
              className="h-6 w-6 object-contain"
            />
          </span>
          <span className="min-w-0">
            <span className="block text-lg font-bold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              Emergency QR
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2 md:gap-4 sm:gap-8 overflow-visible">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1.5 md:gap-2 px-3 py-2 rounded-full border border-white/50 bg-white/65 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition-all duration-300 active:scale-95"
              style={{
                color: 'var(--ink)'
              }}
            >
              <Languages size={16} />
              <span className="text-[12px] font-bold">{currentLang.label}</span>
              <ChevronDown size={12} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <div
                className="absolute top-full right-0 mt-2 w-32 py-2 rounded-2xl border shadow-xl z-[150] animate-in fade-in slide-in-from-top-2 duration-200"
                style={{
                  background: 'rgba(255,255,255,0.82)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  borderColor: 'var(--glass-border)',
                }}
              >
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-[13px] font-bold transition-colors hover:bg-white/70 ${lang === l.code ? 'text-accent' : ''}`}
                    style={{ color: 'var(--ink)' }}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <Link to="/create" className="hidden md:flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2.5 text-sm font-bold text-white transition-all duration-300 group shadow-[0_18px_35px_rgba(214,31,69,0.22)]" aria-label="Create Profile">
              <User size={18} className="transition-transform group-hover:scale-110" />
              <span>{t.createProfile}</span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
