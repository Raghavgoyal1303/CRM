import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

import LeadStatusBadge from './LeadStatusBadge';

const LeadsTable = ({ leads, isAdmin }) => {
  return (
    <div className="bg-card border border-white/5 rounded-xl overflow-hidden mt-8">
      <table className="w-full text-left">
        <thead className="bg-white/5 text-xs font-bold uppercase tracking-widest text-text-secondary border-b border-white/5">
          <tr>
            <th className="px-6 py-4">Lead Info</th>
            <th className="px-6 py-4">Status</th>
            {isAdmin && <th className="px-6 py-4">Assigned To</th>}
            <th className="px-6 py-4">Created</th>
            <th className="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {leads.map((lead) => (
            <tr key={lead.id} className="hover:bg-white/5 transition-colors group">
              <td className="px-6 py-4">
                <div className="font-medium text-text-primary">{lead.phone_number}</div>
                <div className="text-xs text-text-secondary">{lead.name || 'Anonymous'}</div>
              </td>
              <td className="px-6 py-4">
                <LeadStatusBadge status={lead.status} />
              </td>
              {isAdmin && (
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-[10px] text-accent font-bold">
                      {lead.assigned_employee?.substring(0, 2).toUpperCase() || '??'}
                    </div>
                    <span className="text-sm text-text-secondary">{lead.assigned_employee || 'Unassigned'}</span>
                  </div>
                </td>
              )}
              <td className="px-6 py-4 text-sm text-text-secondary">
                {new Date(lead.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-right">
                <Link to={`/leads/${lead.id}`} className="text-accent hover:text-white transition-colors opacity-0 group-hover:opacity-100 flex items-center gap-2 justify-end text-sm">
                  View Detail <ExternalLink size={14} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {leads.length === 0 && (
        <div className="p-12 text-center text-text-secondary italic">
          No leads found in this view.
        </div>
      )}
    </div>
  );
};

export default LeadsTable;
