import React from 'react';
import BusinessCrudPage from './BusinessCrudPage';

function BusinessTailorsStatus() {
  return (
    <BusinessCrudPage
      title="Business Tailors Status"
      resource="status"
      idKey="status_id"
      defaultForm={{ tailor_name: '', availability_status: 'available', current_workload: 0, last_seen_at: '' }}
      columns={[
        { key: 'status_id', label: 'ID', readOnly: true },
        { key: 'tailor_name', label: 'Tailor Name' },
        { key: 'availability_status', label: 'Availability', options: ['available', 'busy', 'offline'] },
        { key: 'current_workload', label: 'Current Workload' },
        { key: 'last_seen_at', label: 'Last Seen (YYYY-MM-DD HH:MM:SS)' }
      ]}
    />
  );
}

export default BusinessTailorsStatus;
