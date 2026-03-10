import { Link, useLocation } from 'react-router-dom';
import { Home, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const BottomNav = () => {
  const { t } = useLanguage();
  const location = useLocation();

  const navItems = [
    {
      to: '/',
      icon: <Home size={18} />,
      label: t.home || 'Home',
    },
    {
      to: '/create',
      icon: <User size={18} />,
      label: t.createProfile || 'Create',
    },
  ];

  return (
    <div className="md:hidden fixed bottom-4 left-1/2 z-[100] w-[calc(100%-1.5rem)] max-w-sm -translate-x-1/2 rounded-[28px] border border-white/70 bg-[rgba(255,255,255,0.7)] p-2 shadow-[0_24px_50px_rgba(15,23,42,0.12)] backdrop-blur-2xl">
      <div className="grid grid-cols-2 gap-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center justify-center gap-2 rounded-[22px] px-4 py-3 text-base font-semibold transition-base ${isActive ? 'bg-white text-[var(--accent)] shadow-[0_10px_22px_rgba(60,22,34,0.08)]' : 'text-[var(--muted)]'}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
