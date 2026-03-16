import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";
import {
  ServerHealthProvider,
  useServerHealth,
} from "./context/ServerHealthContext";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BottomNav from "./components/BottomNav";
import Home from "./pages/Home";
import CreateProfile from "./pages/CreateProfile";
import EmergencyProfile from "./pages/EmergencyProfile";
import EditProfile from "./pages/EditProfile";
import Success from "./pages/Success";
import { Toaster, toast } from "react-hot-toast";

function AppLayout() {
  const location = useLocation();
  const isEmergencyRoute = location.pathname.startsWith("/emergency/");
  const { isHealthy, isChecking } = useServerHealth();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    const sync = () => setIsMobile(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (isChecking && !isHealthy) {
      toast.loading("Server is starting... Please wait", {
        id: "server-health",
      });
      return;
    }

    if (!isChecking && !isHealthy) {
      toast.error("Server is not responding. Please try again in a moment.", {
        id: "server-health",
        duration: 5000,
      });
      return;
    }

    toast.dismiss("server-health");
  }, [isHealthy, isChecking]);

  const glassBaseStyle = {
    borderRadius: "14px",
    padding: isMobile ? "12px 14px" : "10px 12px",
    fontWeight: "600",
    fontSize: isMobile ? "14px" : "13px",
    boxShadow: isMobile
      ? "0 12px 28px rgba(15, 23, 42, 0.12)"
      : "0 10px 22px rgba(15, 23, 42, 0.1)",
    backdropFilter: "blur(14px) saturate(160%)",
    WebkitBackdropFilter: "blur(14px) saturate(160%)",
  };

  return (
    <div className={`app-shell ${isEmergencyRoute ? "" : "pb-16 md:pb-0"}`}>
      <Toaster
        position={isMobile ? "bottom-center" : "bottom-right"}
        containerStyle={{
          bottom: isMobile ? (isEmergencyRoute ? 14 : 84) : 10,
          right: isMobile ? undefined : 10,
          left: isMobile ? 16 : undefined,
        }}
        toastOptions={{
          duration: 4000,
          style: {
            ...glassBaseStyle,
            background: "rgba(255, 255, 255, 0.62)",
            color: "var(--ink)",
            border: "1px solid rgba(255, 255, 255, 0.6)",
          },
          success: {
            style: {
              ...glassBaseStyle,
              background: isMobile
                ? "#166534"
                : "linear-gradient(135deg, rgba(20, 83, 45, 0.86), rgba(22, 101, 52, 0.74))",
              color: "#ecfdf5",
              border: "1px solid rgba(187, 247, 208, 0.35)",
            },
            iconTheme: {
              primary: "#ecfdf5",
              secondary: "#166534",
            },
          },
          error: {
            style: {
              ...glassBaseStyle,
              background: isMobile
                ? "#b91c1c"
                : "linear-gradient(135deg, rgba(127, 29, 29, 0.9), rgba(185, 28, 28, 0.76))",
              color: "#fff1f2",
              border: "1px solid rgba(254, 202, 202, 0.34)",
            },
            iconTheme: {
              primary: "#fff1f2",
              secondary: "#b91c1c",
            },
          },
        }}
      />
      {!isEmergencyRoute && <Header />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateProfile />} />
          <Route path="/emergency/:id" element={<EmergencyProfile />} />
          <Route path="/edit/:id" element={<EditProfile />} />
          <Route path="/success/:id" element={<Success />} />
        </Routes>
      </main>
      {!isEmergencyRoute && <Footer />}
      {!isEmergencyRoute && <BottomNav />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <ServerHealthProvider>
            <Router
              future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
            >
              <AppLayout />
            </Router>
          </ServerHealthProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
