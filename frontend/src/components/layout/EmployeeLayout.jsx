import React from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Home,
  Target,
  Clock,
  Phone,
  BarChart2,
  User,
  LogOut,
  Infinity,
  Bell,
  Settings,
  Radio,
  Send
} from 'lucide-react';
import UserMenu from '../shared/UserMenu';

const EmployeeLayout = ({ children }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/dashboard/leads', icon: Target, label: 'My Leads' },
    { path: '/dashboard/follow-ups', icon: Clock, label: 'Follow-ups' },
    { path: '/dashboard/outbound', icon: Radio, label: 'Outbound' },
    { path: '/dashboard/calls', icon: Phone, label: 'Call Hist.' },
    { path: '/dashboard/communications', icon: Send, label: 'My Comms' },
    { path: '/dashboard/performance', icon: BarChart2, label: 'My Perf.' },
  ];

  return (
    <div className="bg-[#F9F7F4] h-screen overflow-hidden flex flex-col lg:flex-row font-body">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[240px] bg-white border-r border-[#F0EEF8] flex-col flex-shrink-0 z-50">
        <Link to="/" className="p-8 block hover:opacity-80 transition-opacity group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
              <Infinity className="text-white" size={24} />
            </div>
            <span className="text-xl font-heading font-black text-indigo-900 tracking-tight">Tricity Verified</span>
          </div>
        </Link>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto pt-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group
                ${isActive ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-gray-400 hover:bg-gray-50 hover:text-indigo-600'}
              `}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={20} className={isActive ? 'text-white' : 'group-hover:text-indigo-600'} />
                  <span className={`${isActive ? 'text-white' : 'font-bold text-sm'}`}>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}

        </nav>

        <div className="p-6 border-t border-gray-100 bg-[#FBFBFE]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all font-bold text-sm mb-4"
          >
            <LogOut size={18} /> Exit Portal
          </button>
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs shadow-sm">
              {user?.name?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-black text-indigo-900 truncate">{user?.name || 'Sales Rep'}</p>
              <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Sales Operative</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 min-w-0 flex flex-col relative overflow-hidden">
        {/* Topbar */}
        <header className="h-20 bg-[#F9F7F4]/80 backdrop-blur-md flex items-center justify-between px-6 lg:px-12 flex-shrink-0 z-40">
          <div className="lg:block">
            <h1 className="text-xl font-heading font-black text-indigo-900 tracking-tight">
              Good morning, {user?.name?.split(' ')[0] || 'Sales Rep'} ðŸ‘‹
            </h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{today}</p>
          </div>

          <div className="flex items-center gap-4">
            <button className="w-11 h-11 bg-white border border-[#F0EEF8] rounded-2xl flex items-center justify-center text-gray-400 hover:text-indigo-600 transition-all relative shadow-sm">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button>
            <UserMenu />
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto px-6 lg:px-12 pb-28 lg:pb-12 pt-4">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-[#F0EEF8] px-6 flex items-center justify-around z-[60] shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/dashboard/');
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? 'text-indigo-600 scale-110' : 'text-gray-400'}`}
              >
                <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-indigo-50' : 'bg-transparent'}`}>
                  <item.icon size={20} className={isActive ? 'fill-indigo-600' : ''} />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-tighter ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                  {item.label.split(' ')[item.label.split(' ').length - 1]}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default EmployeeLayout;

