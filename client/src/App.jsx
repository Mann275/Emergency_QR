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
import Auth from "./pages/Auth";
import PreviewProfile from "./pages/PreviewProfile";
import EmergencyProfile from "./pages/EmergencyProfile";
import EditProfile from "./pages/EditProfile";
import Success from "./pages/Success";
import { Toaster, toast } from "react-hot-toast";

function AppLayout() {
  const location = useLocation();
  const isEmergencyRoute = location.pathname.startsWith("/emergency/");
  const isPreviewRoute = location.pathname === "/preview";
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
    padding: "6px 10px",
    fontWeight: "600",
    fontSize: "12px",
    lineHeight: "1.2",
    minWidth: isMobile ? "min(260px, 92vw)" : "240px",
    maxWidth: isMobile ? "92vw" : "420px",
    boxShadow: "0 12px 28px rgba(35, 19, 26, 0.12)",
    backdropFilter: "blur(16px) saturate(160%)",
    WebkitBackdropFilter: "blur(16px) saturate(160%)",
    background: "rgba(255, 255, 255, 0.88)",
    color: "var(--ink)",
    border: "1px solid rgba(35, 19, 26, 0.12)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  return (
    <div className={`app-shell ${isEmergencyRoute ? "" : "pb-24 md:pb-0"}`}>
      <Toaster
        position={isMobile ? "bottom-center" : "bottom-right"}
        containerStyle={{
          bottom: isMobile ? (isEmergencyRoute ? 12 : 82) : 8,
          right: isMobile ? undefined : 10,
          left: isMobile ? 0 : undefined,
          width: isMobile ? "100%" : undefined,
        }}
        toastOptions={{
          duration: 4000,
          style: {
            ...glassBaseStyle,
          },
          success: {
            style: {
              ...glassBaseStyle,
              background: "rgba(255, 255, 255, 0.92)",
              border: "1px solid rgba(200, 30, 75, 0.22)",
            },
            iconTheme: {
              primary: "var(--accent)",
              secondary: "#ffffff",
            },
          },
          error: {
            style: {
              ...glassBaseStyle,
              background: "rgba(255, 255, 255, 0.92)",
              color: "var(--ink)",
              border: "1px solid rgba(220, 38, 38, 0.28)",
            },
            iconTheme: {
              primary: "#dc2626",
              secondary: "#ffffff",
            },
          },
        }}
      />
      {!isEmergencyRoute && <Header />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/preview" element={<PreviewProfile />} />
          <Route path="/create" element={<CreateProfile />} />
          <Route path="/emergency/:id" element={<EmergencyProfile />} />
          <Route path="/edit/:id" element={<EditProfile />} />
          <Route path="/success/:id" element={<Success />} />
        </Routes>
      </main>
      {!isEmergencyRoute && <Footer />}
      {!isEmergencyRoute && !isPreviewRoute && <BottomNav />}
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
