import {
  BarChart3,
  Building2,
  Users,
  ShieldCheck,
  Settings,
  LogOut,
  Infinity,
  Target,
  History,
  ShieldAlert,
  Send,
  PhoneOff,
  Radio,
  Ticket,
  Code2,
  FileSearch
} from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import UserMenu from '../shared/UserMenu';

const SuperAdminLayout = ({ children }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { title: 'Dashboard', icon: BarChart3, path: '/super/dashboard' },
    { title: 'Companies', icon: Building2, path: '/super/companies' },
    { type: 'divider' },
    { title: 'All Leads', icon: Target, path: '/super/leads' },
    { title: 'All Employees', icon: Users, path: '/super/employees' },
    { title: 'Call Logs', icon: History, path: '/super/call-logs' },
    { type: 'divider' },
    { title: 'Campaigns Overview', icon: Radio, path: '/super/campaigns' },
    { title: 'Communications', icon: Send, path: '/super/communications' },
    { title: 'Blacklist Monitor', icon: PhoneOff, path: '/super/blacklist' },
    { type: 'divider' },
    { title: 'Lottery Overview', icon: Ticket, path: '/super/lottery' },
    { title: 'Developer / API', icon: Code2, path: '/super/api-keys' },
    { title: 'Audit Logs', icon: FileSearch, path: '/super/audit' },
    { type: 'divider' },
    { title: 'Analytics', icon: BarChart3, path: '/super/analytics' },
    { title: 'Activity Feed', icon: History, path: '/super/activity' },
    { type: 'divider' },
    { title: 'Settings', icon: Settings, path: '/super/settings' },
  ];

  return (
    <div className="flex bg-[#F9F7F4] h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[240px] bg-white border-r border-[#F0EEF8] flex flex-col flex-shrink-0">
        <Link to="/" className="p-6 flex items-center gap-3 hover:opacity-80 transition-opacity group">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
            <Infinity className="text-white" size={24} />
          </div>
          <span className="text-xl font-heading font-black text-indigo-900 tracking-tight">LeadFlow <span className="text-indigo-400 font-extrabold">SAAS</span></span>
        </Link>

        <nav className="flex-1 px-4 mt-4 space-y-1 overflow-y-auto">
          {navItems.map((item, idx) => (
            item.type === 'divider' ? (
              <div key={idx} className="my-3 border-t border-[#F0EEF8] mx-4" />
            ) : (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isActive
                    ? 'bg-indigo-50 text-indigo-600 font-bold shadow-sm'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
                `}
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={18} className={isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'} />
                    <span className="text-[13px]">{item.title}</span>
                  </>
                )}
              </NavLink>
            )
          ))}
        </nav>

        <div className="p-4 border-t border-[#F0EEF8]">
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 transition-all duration-200 rounded-[10px] text-[10px] font-black uppercase tracking-widest mb-2"
          >
            ← Back to Home
          </Link>
          <div className="p-4 bg-indigo-900 rounded-[16px] text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center font-bold text-xs">SA</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">Super Admin</p>
                <p className="text-[10px] text-indigo-300 uppercase tracking-widest font-black">Full Access</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-indigo-800 hover:bg-indigo-700 transition-colors text-xs font-bold"
            >
              <LogOut size={14} /> Kill Session
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto flex flex-col relative">
        <header className="h-20 bg-[#F9F7F4]/80 backdrop-blur-md flex items-center justify-end px-8 flex-shrink-0 z-40 sticky top-0">
          <UserMenu />
        </header>
        <div className="flex-1 p-8 pt-4">
          {children}
        </div>
      </main>
    </div>
  );
};

export default SuperAdminLayout;
