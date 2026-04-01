import React from 'react';
import BusinessCrudPage from './BusinessCrudPage';

function BusinessTailorLogs() {
  return (
    <BusinessCrudPage
      title="Business Tailor Logs"
      resource="logs"
      idKey="log_id"
      defaultForm={{}}
      columns={[
        { key: 'log_id', label: 'ID', readOnly: true },
        { key: 'page_name', label: 'Page' },
        { key: 'action_type', label: 'Action' },
        { key: 'entity_id', label: 'Entity ID' },
        { key: 'description', label: 'Description' },
        { key: 'actor_user_id', label: 'User ID' },
        { key: 'actor_role', label: 'Role' },
        { key: 'ip_address', label: 'IP Address' },
        { key: 'created_at', label: 'Created At', readOnly: true, type: 'datetime' }
      ]}
    />
  );
}

export default BusinessTailorLogs;
