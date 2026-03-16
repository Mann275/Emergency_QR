import { Link, useLocation } from "react-router-dom";
import { Home, User, LogOut } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

const BottomNav = () => {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully.");
    } catch (error) {
      toast.error(error.message || "Failed to logout.");
    }
  };

  const navItems = [
    {
      to: "/",
      icon: <Home size={16} />,
      label: t.home || "Home",
    },
    ...(!user
      ? [
          {
            to: "/create",
            icon: <User size={16} />,
            label: t.createProfile || "Create",
          },
        ]
      : []),
    ...(user
      ? [
          {
            to: "#logout",
            icon: <LogOut size={16} />,
            label: "Logout",
            isAction: true,
          },
        ]
      : []),
  ];

  return (
    <div className="md:hidden fixed bottom-3 left-1/2 z-[100] w-[calc(100%-1rem)] max-w-xs -translate-x-1/2 rounded-[22px] border border-white/70 bg-[rgba(255,255,255,0.72)] p-1.5 shadow-[0_16px_36px_rgba(15,23,42,0.1)] backdrop-blur-2xl">
      <div
        className={`grid ${navItems.length === 1 ? "grid-cols-1" : "grid-cols-2"} gap-1.5`}
      >
        {navItems.map((item) => {
          const isActive = !item.isAction && location.pathname === item.to;

          if (item.isAction) {
            return (
              <button
                key={item.to}
                type="button"
                onClick={handleLogout}
                className="flex items-center justify-center gap-1.5 rounded-[16px] px-3 py-2 text-sm font-semibold text-[var(--muted)] transition-base hover:bg-white hover:text-[var(--accent)]"
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center justify-center gap-1.5 rounded-[16px] px-3 py-2 text-sm font-semibold transition-base ${isActive ? "bg-white text-[var(--accent)] shadow-[0_8px_18px_rgba(60,22,34,0.08)]" : "text-[var(--muted)]"}`}
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
