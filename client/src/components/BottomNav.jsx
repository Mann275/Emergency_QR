import { Link, useLocation } from 'react-router-dom';
import { Home, PlusSquare, Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const BottomNav = () => {
    const { t } = useLanguage();
    const location = useLocation();

    const navItems = [
        {
            to: '/',
            icon: <Home size={22} />,
            label: 'Home'
        },
        {
            to: '/create',
            icon: <PlusSquare size={22} />,
            label: t.createProfile || 'Create'
        },
        // You can add more icons if needed, like Search or Scan
    ];

    return (
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[300px] h-[72px] z-[100] transition-base rounded-full shadow-2xl glass-nav block" style={{ padding: '0px 8px' }}>
            <div className="flex items-center justify-around px-2 py-3 pb-safe">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.to;
                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`flex flex-col items-center justify-center w-full gap-1 p-2 transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-50 hover:opacity-80'
                                }`}
                            style={{ color: isActive ? 'var(--ink)' : 'var(--ink)' }}
                        >
                            <div className={`${isActive ? '-translate-y-1' : ''} transition-transform duration-300`}>
                                {item.icon}
                            </div>
                            <span className="text-[10px] font-bold tracking-wider uppercase">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;
