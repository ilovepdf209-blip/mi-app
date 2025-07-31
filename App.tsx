import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterPassenger from './pages/RegisterPassenger';
import RegisterDriver from './pages/RegisterDriver'; // <-- Nueva importación
import HowItWorks from './pages/HowItWorks';
import SustainableTravel from './pages/SustainableTravel'; // <-- Nueva importación
import Security from './pages/Security';
import SearchPage from './pages/SearchPage';
import TripDetailsPage from './pages/TripDetailsPage';
import AppFooter from './components/AppFooter';
import SplashCursor from './components/SplashCursor';
import CorporateLogin from './pages/CorporateLogin'; // <-- Nueva importación
import PublishTrip from './pages/PublishTrip';
import TravelHistory from './pages/TravelHistory';
import ProfileUser from './pages/ProfileUser';
import AboutUs from './pages/AboutUs';
import BlogNoticias from './pages/BlogNoticias';
import Mision from './pages/Mision';
import ProfileRouter from './pages/ProfileRouter';
import Faq from './pages/Faq';
import Support from './pages/Support';
import Contact from './pages/Contact';
import LegalPrivacy from './pages/LegalPrivacy';
import LegalTerminos from './pages/LegalTerminos';
import LegalPrivacidad from './pages/LegalPrivacidad';
import LegalCookies from './pages/LegalCookies';
import LegalAvisos from './pages/LegalAvisos';
import AdminLayout from './pages/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminEmpresas from './pages/AdminEmpresas';
import AdminUsuarios from './pages/AdminUsuarios';
import AdminConductores from './pages/AdminConductores';
import AdminVehiculos from './pages/AdminVehiculos';
import AdminViajes from './pages/AdminViajes';
import AdminFacturacion from './pages/AdminFacturacion';
import AdminSoporte from './pages/AdminSoporte';
import AdminLogin from './pages/AdminLogin';
import CreateAdminUser from './pages/CreateAdminUser';
import NotificationContainer from './components/NotificationContainer';
import TestPage from './pages/TestPage';
import TestChatPage from './pages/TestChatPage';
import SimpleTestPage from './pages/SimpleTestPage';
import ChatPage from './pages/ChatPage';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const AnimatedBackground = () => (
    <div className="fixed inset-0 -z-10 pointer-events-none bg-slate-900">
        <div className="absolute w-96 h-96 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl opacity-50 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse [animation-duration:10s] opacity-50" />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-bounce [animation-duration:12s] opacity-50" />
    </div>
);

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const [allowed, setAllowed] = useState<null | boolean>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const check = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        setAllowed(false);
        navigate('/admin/login');
        return;
      }
      const db = getFirestore();
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists() && userSnap.data().role === 'admin') {
        setAllowed(true);
      } else {
        setAllowed(false);
        navigate('/admin/login');
      }
    };
    check();
    // eslint-disable-next-line
  }, []);

  if (allowed === null) return <div className="text-center p-10 text-white/50">Verificando acceso...</div>;
  if (!allowed) return null;
  return <>{children}</>;
}

function AppContent() {
  const location = useLocation();
  const isCorporateLogin = location.pathname === "/corporate-login";
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isDashboardRoute = location.pathname === "/dashboard";

  const shouldShowNavbar = !isCorporateLogin && !isAdminRoute && !isDashboardRoute;

  return (
    <div className="bg-slate-900 text-white min-h-screen font-sans flex flex-col">
            <SplashCursor />
            <AnimatedBackground />
            <NotificationContainer />
      {shouldShowNavbar && <Navbar />}
      <main className="flex-grow flex flex-col">
                <Routes>
                    <Route path="/test" element={<TestPage />} />
                    <Route path="/test-chat" element={<TestChatPage />} />
                    <Route path="/simple-test" element={<SimpleTestPage />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/driver" element={<RegisterDriver />} />
          <Route path="/register/passenger" element={<RegisterPassenger />} />
          <Route path="/profile" element={<ProfileRouter />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/sustainable-travel" element={<SustainableTravel />} />
                    <Route path="/security" element={<Security />} />
          <Route path="/corporate-login" element={<CorporateLogin />} />
          <Route path="/login" element={<Login />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/trip/:tripId" element={<TripDetailsPage />} />
                    <Route path="/chat/:tripId" element={<ChatPage />} />
          <Route path="/publish-trip" element={<PublishTrip />} />
          <Route path="/travel-history" element={<TravelHistory />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/blog" element={<BlogNoticias />} />
          <Route path="/mision" element={<Mision />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/support" element={<Support />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/legal" element={<LegalPrivacy />} />
          <Route path="/legal/terminos" element={<LegalTerminos />} />
          <Route path="/legal/privacidad" element={<LegalPrivacidad />} />
          <Route path="/legal/cookies" element={<LegalCookies />} />
          <Route path="/legal/avisos" element={<LegalAvisos />} />
          <Route path="/create-admin" element={<CreateAdminUser />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
            <Route index element={<AdminDashboard />} />
            <Route path="empresas" element={<AdminEmpresas />} />
            <Route path="usuarios" element={<AdminUsuarios />} />
            <Route path="conductores" element={<AdminConductores />} />
            <Route path="vehiculos" element={<AdminVehiculos />} />
            <Route path="viajes" element={<AdminViajes />} />
            <Route path="facturacion" element={<AdminFacturacion />} />
            <Route path="soporte" element={<AdminSoporte />} />
          </Route>
                </Routes>
            </main>
      {shouldShowNavbar && <AppFooter />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;