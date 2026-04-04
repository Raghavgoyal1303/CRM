import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search, User, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Topbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Simple breadcrumb logic
  const pathParts = location.pathname.split('/').filter(p => p);
  const pageTitle = pathParts[pathParts.length - 1] || 'Dashboard';
  const capitalizedTitle = pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1);

  return (
    <div className="h-16 bg-white border-b border-border flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm shadow-black/[0.02]">
      {/* Left: Title & Breadcrumbs */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2 text-xs text-text-secondary uppercase tracking-widest font-semibold mb-0.5">
          <span>LeadFlow</span>
          <ChevronRight size={12} />
          <span className="text-primary">{capitalizedTitle}</span>
        </div>
        <h1 className="text-lg font-bold text-text-primary font-heading leading-tight pt-1">
          {location.pathname.includes('admin') ? 'Executive Overview' : capitalizedTitle}
        </h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className="relative group hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search leads..."
            className="bg-[#F3F4F6] border-none rounded-full pl-10 pr-4 py-2 text-sm w-64 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
          />
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4 border-l border-border pl-6">
          <button className="relative p-2 text-text-secondary hover:text-primary hover:bg-primary/5 rounded-full transition-all">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <div className="w-9 h-9 rounded-full bg-status-site-visit-bg flex items-center justify-center text-primary ring-2 ring-primary/10 cursor-pointer shadow-sm">
            <User size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
