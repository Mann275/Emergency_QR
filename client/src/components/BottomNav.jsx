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
            label: t.home || 'Home'
        },
        {
            to: '/create',
            icon: <User size={18} />,
            label: t.createProfile || 'Create'
        },
    ];

    return (
        <div className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 w-max h-[64px] z-[100] transition-base rounded-full shadow-2xl glass-nav overflow-hidden border border-white/10 dark:border-white/5 flex items-center" style={{ padding: '0px 24px', top: 'auto' }}>
            <div className="flex items-center justify-around h-full gap-8">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.to;
                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`flex flex-col items-center justify-center w-full gap-0.5 transition-all duration-300 ${isActive ? 'opacity-100 scale-105' : 'opacity-40 hover:opacity-70'
                                }`}
                            style={{ color: 'var(--ink)' }}
                        >
                            <div className="transition-transform duration-300">
                                {item.icon}
                            </div>
                            <span className="text-[9px] font-bold tracking-widest uppercase">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;
