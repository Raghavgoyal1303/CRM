import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  PhoneCall, 
  History, 
  CalendarCheck, 
  Settings, 
  LogOut,
  Square
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  
  const links = [
    { name: 'Dashboard', path: user?.role === 'admin' ? '/admin' : '/dashboard', icon: LayoutDashboard },
    { name: 'Leads', path: '/leads', icon: PhoneCall },
    { name: 'Employees', path: '/employees', icon: Users, adminOnly: true },
    { name: 'Call Logs', path: '/call-logs', icon: History },
    { name: 'Follow-ups', path: '/follow-ups', icon: CalendarCheck },
    { name: 'Settings', path: '/settings', icon: Settings },
  ].filter(link => !link.adminOnly || user?.role === 'admin');

  const initials = user?.name?.split(' ').map(n => n[0]).join('') || '??';

  return (
    <div className="w-[240px] bg-white border-r border-border h-screen flex flex-col">
      {/* Logo Section */}
      <Link to="/" className="p-6 flex items-center gap-3 hover:opacity-80 transition-opacity">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <Square className="fill-white" size={20} />
        </div>
        <span className="font-heading font-bold text-xl text-text-primary">LeadFlow CRM</span>
      </Link>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1.5 mt-4">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-[12px] transition-all duration-200 group ${
                isActive 
                  ? 'bg-status-site-visit-bg text-primary font-semibold' 
                  : 'text-text-secondary hover:bg-background hover:text-text-primary'
              }`
            }
          >
            <link.icon size={20} className={({ isActive }) => isActive ? 'text-primary' : 'text-text-secondary group-hover:text-text-primary'} />
            <span className="text-[14px]">{link.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Session Section */}
      <div className="p-4 mt-auto border-t border-border bg-background/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-heading font-bold text-sm shadow-md">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-text-primary truncate">{user?.name}</div>
            <div className="badge bg-status-site-visit-bg text-primary text-[10px] px-2 py-0.5 mt-0.5">
              {user?.role}
            </div>
          </div>
        </div>
        <Link 
          to="/"
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-primary hover:bg-indigo-50 transition-all duration-200 rounded-[10px] text-[11px] font-black uppercase tracking-widest mb-2"
        >
          ← Back to Home
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-text-secondary hover:text-red-500 hover:bg-red-50 transition-all duration-200 rounded-[10px] text-sm font-medium"
        >
          <LogOut size={16} />
          Logout Session
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
