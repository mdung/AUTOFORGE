import { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  Wrench, Users, Calendar, ClipboardList, CheckSquare, FileText,
  Settings, Package, MapPin, ShieldCheck, Search, TrendingUp, Clock, Layers,
  Sun, Moon
} from 'lucide-react';
import './i18n';
import { useAppointments } from './hooks/useApi';

// Views
import LoginPage from './views/LoginPage';
import DashboardPage from './views/DashboardPage';
import AppointmentsPage from './views/AppointmentsPage';
import CalendarViewPage from './views/CalendarViewPage';
import WorkshopBoardPage from './views/WorkshopBoardPage';
import CustomersPage from './views/CustomersPage';
import VehiclesPage from './views/VehiclesPage';
import PartsPage from './views/PartsPage';
import QcInspectionPage from './views/QcInspectionPage';
import VehicleDeliveryPage from './views/VehicleDeliveryPage';
import UserAdminPage from './views/UserAdminPage';
import SettingsPage from './views/SettingsPage';
import AuditLogPage from './views/AuditLogPage';
import EstimatesPage from './views/EstimatesPage';

// Auth Context
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  token: string;
}

interface Tenant {
  id: string;
  name: string;
  plan: string;
}

interface AuthContextType {
  user: User | null;
  tenant: Tenant | null;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  login: (user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  tenant: null,
  theme: 'dark',
  toggleTheme: () => {},
  login: () => {},
  logout: () => {}
});

export const useAuth = () => useContext(AuthContext);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false }
  }
});

// Wrapper for CalendarViewPage to inject data from hooks
function CalendarWrapper() {
  const { user } = useAuth();
  const { data: appointments = [] } = useAppointments(user?.token);
  return <CalendarViewPage appointments={appointments} />;
}

// Layout with sidebar + header + main content
function AppLayout() {
  const { t } = useTranslation();
  const { user, tenant, theme, toggleTheme, logout } = useAuth();
  const [globalSearch, setGlobalSearch] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', icon: <Layers size={18} />, label: t('navigation.dashboard') },
    { path: '/appointments', icon: <Calendar size={18} />, label: t('navigation.appointments') },
    { path: '/calendar', icon: <Calendar size={18} />, label: 'Lịch Hẹn & Bay' },
    { path: '/checkin', icon: <MapPin size={18} />, label: t('navigation.checkin') },
    { path: '/dvi', icon: <ClipboardList size={18} />, label: t('navigation.dvi') },
    { path: '/estimates', icon: <FileText size={18} />, label: t('navigation.estimates') },
    { path: '/workshop', icon: <CheckSquare size={18} />, label: t('navigation.workshop') },
    { path: '/tech', icon: <Clock size={18} />, label: 'Technician PWA' },
    { path: '/parts', icon: <Package size={18} />, label: t('navigation.parts') },
    { path: '/customers', icon: <Users size={18} />, label: t('navigation.customers') },
    { path: '/vehicles', icon: <Wrench size={18} />, label: t('navigation.vehicles') },
    { path: '/fleet', icon: <TrendingUp size={18} />, label: t('navigation.fleet') },
    { path: '/portal', icon: <Users size={18} />, label: t('navigation.portal') },
    { path: '/qc', icon: <ShieldCheck size={18} />, label: t('navigation.qc') },
    { path: '/delivery', icon: <MapPin size={18} />, label: t('navigation.delivery') },
    { path: '/audit', icon: <ClipboardList size={18} />, label: t('navigation.audit') },
    { path: '/admin', icon: <Users size={18} />, label: 'Phân Quyền Staff' },
    { path: '/settings', icon: <Settings size={18} />, label: t('navigation.settings') },
  ];

  return (
    <div className="app-container">
      <nav className="sidebar" aria-label="Main navigation">
        <div className="sidebar-logo">
          <Wrench size={24} className="text-primary" />
          Auto<span>Forge</span>
        </div>
        <ul className="sidebar-menu" role="menubar">
          {navItems.map((item) => (
            <li className="sidebar-item" key={item.path} role="none">
              <NavLink
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                role="menuitem"
                aria-label={item.label}
              >
                {item.icon} {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="sidebar-footer">
          <div>Role: {user?.role}</div>
          <button
            className="btn btn-secondary"
            style={{ marginTop: '10px', width: '100%' }}
            onClick={handleLogout}
            aria-label="Sign out"
          >
            Sign Out
          </button>
        </div>
      </nav>

      <div className="main-content">
        <header className="header" role="banner">
          <div className="header-search">
            <Search size={18} className="text-muted" />
            <input
              type="text"
              placeholder="Search VIN, license plate, customer, phone..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              aria-label="Global search"
            />
          </div>
          <div className="header-right">
            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Chuyển sang Giao diện Sáng' : 'Chuyển sang Giao diện Tối'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="user-profile">
              <div className="user-avatar" aria-hidden="true">
                {user?.firstName[0]}{user?.lastName[0]}
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>{user?.firstName} {user?.lastName}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{tenant?.name}</div>
              </div>
            </div>
          </div>
        </header>

        <main className="scroll-area" role="main" aria-label="Page content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/calendar" element={<CalendarWrapper />} />
            <Route path="/checkin" element={<div><h2>Vehicle Check-in</h2><p>Check-in wizard coming soon.</p></div>} />
            <Route path="/dvi" element={<div><h2>Inspection (DVI)</h2><p>DVI module coming soon.</p></div>} />
            <Route path="/estimates" element={<EstimatesPage />} />
            <Route path="/workshop" element={<WorkshopBoardPage />} />
            <Route path="/tech" element={<div><h2>Technician PWA</h2><p>Tech timer module coming soon.</p></div>} />
            <Route path="/parts" element={<PartsPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/vehicles" element={<VehiclesPage />} />
            <Route path="/fleet" element={<div><h2>Fleet Analytics</h2><p>Fleet module coming soon.</p></div>} />
            <Route path="/portal" element={<div><h2>Customer Portal</h2><p>Portal module coming soon.</p></div>} />
            <Route path="/qc" element={<QcInspectionPage />} />
            <Route path="/delivery" element={<VehicleDeliveryPage />} />
            <Route path="/audit" element={<AuditLogPage />} />
            <Route path="/admin" element={<UserAdminPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

// Root App with providers and auth gate
export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('autoforge_theme') as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('autoforge_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const login = (u: User) => {
    setUser(u);
    setTenant({ id: 't-1', name: 'AutoForge Motors Group', plan: 'BUSINESS' });
  };

  const logout = () => {
    setUser(null);
    setTenant(null);
  };

  return (
    <AuthContext.Provider value={{ user, tenant, theme, toggleTheme, login, logout }}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route
              path="/login"
              element={
                user ? <Navigate to="/" replace /> : <LoginPage onLoginSuccess={login} />
              }
            />
            <Route
              path="/*"
              element={user ? <AppLayout /> : <Navigate to="/login" replace />}
            />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </AuthContext.Provider>
  );
}
