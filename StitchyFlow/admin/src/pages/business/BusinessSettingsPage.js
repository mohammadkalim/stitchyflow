import React from 'react';
import BusinessCrudPage from './BusinessCrudPage';

function BusinessSettingsPage() {
  return (
    <BusinessCrudPage
      title="Business Settings"
      resource="settings"
      idKey="setting_id"
      defaultForm={{ setting_key: '', setting_value: '', setting_group: 'general', is_active: 1 }}
      columns={[
        { key: 'setting_id', label: 'ID', readOnly: true },
        { key: 'setting_key', label: 'Setting Key' },
        { key: 'setting_value', label: 'Setting Value' },
        { key: 'setting_group', label: 'Group' },
        { key: 'is_active', label: 'Active (1/0)' }
      ]}
    />
  );
}

export default BusinessSettingsPage;
