import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  Users,
  Target,
  History,
  Clock,
  Settings,
  LogOut,
  Infinity,
  BarChart3,
  Send,
  PhoneOff,
  Radio,
  UserCheck,
  ListRestart,
  Ticket,
  Code2,
  FileSearch
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LiveCallPopup from '../shared/LiveCallPopup';
import UserMenu from '../shared/UserMenu';

const AdminLayout = ({ children }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { title: 'Dashboard', icon: BarChart3, path: '/admin' },
    { title: 'Leads', icon: Target, path: '/admin/leads' },
    { title: 'Employees', icon: Users, path: '/admin/employees' },
    { title: 'Call Logs', icon: History, path: '/admin/call-logs' },
    { title: 'Follow-ups', icon: Clock, path: '/admin/follow-ups' },
    { type: 'divider' },
    { title: 'Campaigns', icon: Radio, path: '/admin/campaigns' },
    { title: 'Outbound Leads', icon: UserCheck, path: '/admin/outbound-leads' },
    { title: 'Communications', icon: Send, path: '/admin/communications' },
    { title: 'Blacklist', icon: PhoneOff, path: '/admin/blacklist' },
    { title: 'Retry Queue', icon: ListRestart, path: '/admin/retry-queue' },
    { type: 'divider' },
    { title: 'Lottery', icon: Ticket, path: '/admin/lottery' },
    { title: 'Developer API', icon: Code2, path: '/admin/developer' },
    { title: 'Audit Log', icon: FileSearch, path: '/admin/audit' },
    { type: 'divider' },
    { title: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
    { title: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <div className="flex bg-[#F9F7F4] h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[240px] bg-white border-r border-[#F0EEF8] flex flex-col flex-shrink-0 relative z-50">
        <Link to="/" className="p-6 flex items-center gap-3 hover:opacity-80 transition-opacity group">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
            <Infinity className="text-white" size={24} />
          </div>
          <span className="text-xl font-heading font-black text-indigo-900 tracking-tight transition-all">Tricity Verified</span>
        </Link>

        <nav className="flex-1 px-4 mt-4 space-y-1 overflow-y-auto pb-8">
          {navItems.map((item, idx) => (
            item.type === 'divider' ? (
              <div key={idx} className="my-3 border-t border-[#F0EEF8] mx-4" />
            ) : (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group
                  ${isActive
                    ? 'bg-indigo-50 text-indigo-600 font-bold shadow-sm'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
                `}
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={17} className={isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'} />
                    <span className="text-[12px]">{item.title}</span>
                  </>
                )}
              </NavLink>
            )
          ))}
        </nav>

        {/* Company Info Card */}
        <div className="p-4 border-t border-[#F0EEF8]">
          <div className="p-4 bg-gray-50 rounded-[20px] border border-[#F0EEF8] group hover:border-indigo-200 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#F0EEF8] flex items-center justify-center font-black text-indigo-600 shadow-sm">
                {user?.company_name?.charAt(0) || 'C'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{user?.company_name || 'My Company'}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <p className="text-[10px] text-emerald-600 font-black uppercase tracking-wider">Active License</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
              <div className="w-8 h-8 rounded-full bg-white border border-[#F0EEF8] flex items-center justify-center text-[10px] font-black text-gray-400">
                {user?.name?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-gray-700 truncate">{user?.name}</p>
                <div className="flex items-center gap-3">
                  <button onClick={handleLogout} className="text-[9px] text-rose-500 font-black uppercase tracking-widest hover:underline">Log Out</button>
                  <Link to="/" className="text-[9px] text-indigo-600 font-black uppercase tracking-widest hover:underline">Home</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto flex flex-col relative">
        <header className="h-20 bg-[#F9F7F4]/80 backdrop-blur-md flex items-center justify-end px-8 flex-shrink-0 z-40 sticky top-0">
          <UserMenu />
        </header>
        <div className="flex-1 p-8 pt-4">
          <LiveCallPopup />
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

