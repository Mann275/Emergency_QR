import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, User, Languages } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Header = () => {
  const { lang, setLang, t } = useLanguage();
  const [isLight, setIsLight] = useState(() => {
    return localStorage.getItem('theme') === 'light';
  });

  useEffect(() => {
    if (isLight) {
      document.body.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
    }
  }, [isLight]);

  return (
    <header className="glass-nav">
      <nav className="flex items-center justify-between px-4 sm:px-6">
        <Link to="/" className="text-lg font-bold tracking-tight transition-base hover:opacity-50" style={{ fontFamily: 'var(--font-heading)' }}>
          Emergency QR
        </Link>

        <div className="flex items-center gap-4 sm:gap-8 overflow-visible">
          {/* Language Selector */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300"
            style={{
              borderColor: 'var(--line)',
              background: 'var(--surface)',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}>
            <Languages size={16} className="opacity-60" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent text-[12px] font-bold outline-none border-none cursor-pointer uppercase py-0.5 px-1 pr-5"
              style={{
                color: 'var(--ink)',
                appearance: 'none',
              }}
              aria-label="Select language"
            >
              <option value="en" style={{ background: 'var(--surface)', color: 'var(--ink)' }}>EN</option>
              <option value="hi" style={{ background: 'var(--surface)', color: 'var(--ink)' }}>हिन्दी</option>
              <option value="gu" style={{ background: 'var(--surface)', color: 'var(--ink)' }}>ગુજરાતી</option>
            </select>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <Link to="/create" className="flex items-center gap-2 text-sm font-bold opacity-80 hover:opacity-100 transition-all duration-300 group" aria-label="Create Profile">
              <div className="p-1.5 rounded-full bg-black/5 dark:bg-white/5 transition-colors group-hover:bg-accent group-hover:text-accent-ink">
                <User size={18} />
              </div>
              <span className="hidden sm:inline-block">{t.createProfile}</span>
            </Link>

            <button
              onClick={() => setIsLight(!isLight)}
              className="hover:opacity-50 transition-all duration-300 p-1.5 opacity-60"
              aria-label="Toggle theme"
            >
              {isLight ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
