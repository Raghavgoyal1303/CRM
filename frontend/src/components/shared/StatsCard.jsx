import React from 'react';

const StatsCard = ({ title, value, icon: Icon, colorClass, trend, trendValue }) => (
  <div className="card card-hover flex flex-col relative overflow-hidden">
    <div className={`w-10 h-10 rounded-[10px] ${colorClass} flex items-center justify-center mb-4 shadow-sm`}>
      <Icon size={20} />
    </div>
    
    <div className="flex flex-col">
      <div className="text-[28px] font-heading font-bold text-text-primary leading-none mb-1">
        {value}
      </div>
      <div className="text-[13px] font-medium text-text-secondary">
        {title}
      </div>
    </div>

    {trendValue && (
      <div className={`absolute bottom-6 right-6 flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
        trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
      }`}>
        {trend === 'up' ? '↑' : '↓'} {trendValue}
      </div>
    )}
  </div>
);

export default StatsCard;
