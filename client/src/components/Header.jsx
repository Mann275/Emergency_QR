import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, PlusCircle } from 'lucide-react';

const Header = () => {
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
      <nav className="flex items-center justify-between">
        <Link to="/" className="text-base font-semibold tracking-tight transition-base hover:opacity-50">
          Emergency QR
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/create" className="flex items-center gap-2 text-sm font-medium tracking-tight hover:opacity-50 transition-base">
            <PlusCircle size={18} />
            Create Profile
          </Link>

          <button
            onClick={() => setIsLight(!isLight)}
            className="hover:opacity-50 transition-base p-1"
            aria-label="Toggle theme"
          >
            {isLight ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
