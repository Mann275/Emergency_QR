import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, User, Languages, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const Header = () => {
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
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
    <header className="glass-nav !px-4 !py-3 md:!px-8 md:!py-4">
      <nav className="flex items-center justify-between">
        <Link to="/" className="text-lg font-bold tracking-tight transition-base" style={{ fontFamily: 'var(--font-heading)' }}>
          Emergency QR
        </Link>

        <div className="flex items-center gap-2 md:gap-4 sm:gap-8 overflow-visible">
          {/* Custom Language Selector */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1.5 md:gap-2 px-2 py-1.5 transition-all duration-300 active:scale-95"
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
                  background: 'var(--surfaceRaised)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  borderColor: 'var(--line)',
                }}
              >
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-[13px] font-bold transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${lang === l.code ? 'text-accent' : ''}`}
                    style={{ color: 'var(--ink)' }}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <Link to="/create" className="hidden md:flex items-center gap-2 text-sm font-bold transition-all duration-300 group" aria-label="Create Profile" style={{ color: 'var(--ink)' }}>
              <User size={18} className="transition-transform group-hover:scale-110" />
              <span>{t.createProfile}</span>
            </Link>

            <button
              onClick={toggleTheme}
              className="transition-all duration-300 ml-2"
              aria-label="Toggle theme"
              style={{ color: 'var(--ink)' }}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
