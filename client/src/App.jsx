import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import CreateProfile from './pages/CreateProfile';
import EmergencyProfile from './pages/EmergencyProfile';
import EditProfile from './pages/EditProfile';
import Success from './pages/Success';
import { Toaster } from 'react-hot-toast';

function AppLayout() {
  const location = useLocation();
  const isEmergencyRoute = location.pathname.startsWith('/emergency/');

  return (
    <div className={`app-shell ${isEmergencyRoute ? '' : 'pb-20 md:pb-0'}`}>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--surface)',
            color: 'var(--ink)',
            border: '1px solid var(--line)',
            borderRadius: '12px',
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
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppLayout />
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
