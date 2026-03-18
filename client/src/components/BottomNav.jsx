import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, MessageSquare, User } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

const USER_PROFILE_KEY_PREFIX = "emergency_user_profile:";
const getUserProfileKey = (authUid) => `${USER_PROFILE_KEY_PREFIX}${authUid}`;

const BottomNav = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const location = useLocation();
  const [profileId, setProfileId] = useState("");

  useEffect(() => {
    if (!user?.uid) {
      setProfileId("");
      return;
    }

    setProfileId(localStorage.getItem(getUserProfileKey(user.uid)) || "");
  }, [user?.uid, location.pathname]);

  const navItems = [
    {
      to: "/",
      icon: <Home size={18} />,
      label: t.home || "Home",
      dataKey: "home",
    },
    ...(!user || !profileId
      ? [
          {
            to: "/create",
            icon: <User size={18} />,
            label: t.createProfile || "Create",
            dataKey: "createProfile",
          },
        ]
      : []),
    ...(user && profileId
      ? [
          {
            to: `/emergency/${profileId}`,
            icon: <User size={18} />,
            label: "My Profile",
            dataKey: "myProfile",
          },
        ]
      : []),
    ...(user
      ? [
          {
            to: "/contact",
            icon: <MessageSquare size={18} />,
            label: "Contact",
            dataKey: "contact",
          },
        ]
      : []),
  ];

  return (
    <div className="md:hidden fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] left-1/2 z-[100] w-[calc(100%-1.25rem)] max-w-sm -translate-x-1/2 rounded-[22px] border border-white/70 bg-[rgba(255,255,255,0.76)] p-2 shadow-[0_14px_30px_rgba(15,23,42,0.1)] backdrop-blur-2xl">
      <div
        className={`grid ${navItems.length === 1 ? "grid-cols-1" : navItems.length === 2 ? "grid-cols-2" : "grid-cols-3"} gap-2`}
      >
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;

          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => window.scrollTo(0, 0)}
              className={`flex flex-col items-center justify-center gap-1 rounded-[16px] px-2.5 py-2.5 text-xs font-semibold transition-base ${isActive ? "bg-white text-[var(--accent)] shadow-[0_8px_16px_rgba(60,22,34,0.08)]" : "text-[var(--muted)]"}`}
            >
              {item.icon}
              <span className="text-[11px] leading-none" data-t={item.dataKey}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
