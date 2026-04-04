import React from 'react';

const LeadStatusBadge = ({ status }) => {
  const styles = {
    new: 'bg-status-new-bg text-status-new-text',
    contacted: 'bg-status-contacted-bg text-status-contacted-text',
    interested: 'bg-status-interested-bg text-status-interested-text',
    site_visit: 'bg-status-site-visit-bg text-status-site-visit-text',
    closed: 'bg-status-closed-bg text-status-closed-text',
    lost: 'bg-status-lost-bg text-status-lost-text',
  };

  return (
    <span className={`badge ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
      {status.replace('_', ' ')}
    </span>
  );
};

export default LeadStatusBadge;
