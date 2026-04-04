import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Settings, 
  LogOut, 
  ShieldCheck, 
  Activity, 
  BarChart3, 
  Users, 
  Key,
  ChevronDown,
  Clock,
  Target
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getMenuItems = () => {
    const common = [
      { label: 'Logout', icon: LogOut, onClick: handleLogout, color: 'text-rose-500 hover:bg-rose-50' }
    ];

    switch (user?.role) {
      case 'superadmin':
        return [
          { label: 'Super Settings', icon: Settings, path: '/super/settings' },
          { label: 'Companies', icon: ShieldCheck, path: '/super/companies' },
          { label: 'Platform Audit', icon: Activity, path: '/super/audit' },
          ...common
        ];
      case 'admin':
        return [
          { label: 'My Profile', icon: User, path: '/admin/settings' },
          { label: 'Team Management', icon: Users, path: '/admin/employees' },
          { label: 'API Keys', icon: Key, path: '/admin/developer' },
          { label: 'Security Audit', icon: Clock, path: '/admin/audit' },
          ...common
        ];
      case 'employee':
        return [
          { label: 'My Profile', icon: User, path: '/dashboard/performance' },
          { label: 'My Leads', icon: Target, path: '/dashboard/leads' },
          { label: 'My Performance', icon: BarChart3, path: '/dashboard/performance' },
          ...common
        ];
      default:
        return common;
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1.5 rounded-2xl hover:bg-white/10 transition-all border border-transparent hover:border-[#F0EEF8] hover:shadow-sm group"
      >
        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-lg shadow-indigo-100 group-hover:scale-105 transition-transform">
          {user.name?.charAt(0).toUpperCase()}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-[13px] font-black text-indigo-900 leading-none mb-1">{user.name}</p>
          <p className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest">{user.role}</p>
        </div>
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-[#F0EEF8] overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-[#F0EEF8] bg-gray-50/50">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Account</p>
            <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
          </div>
          
          <div className="p-2">
            {getMenuItems().map((item, idx) => (
              <React.Fragment key={idx}>
                {item.path ? (
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                  >
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      item.onClick();
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${item.color || 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
