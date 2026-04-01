import React from 'react';
import BusinessCrudPage from './BusinessCrudPage';

function BusinessTailorInformationIp() {
  return (
    <BusinessCrudPage
      title="Business Tailor Information/IP"
      resource="informationIp"
      idKey="info_id"
      defaultForm={{ tailor_name: '', ip_address: '', device_name: '', device_type: '', browser: '', notes: '' }}
      columns={[
        { key: 'info_id', label: 'ID', readOnly: true },
        { key: 'tailor_name', label: 'Tailor Name' },
        { key: 'ip_address', label: 'IP Address' },
        { key: 'device_name', label: 'Device Name' },
        { key: 'device_type', label: 'Device Type' },
        { key: 'browser', label: 'Browser' },
        { key: 'notes', label: 'Notes' }
      ]}
    />
  );
}

export default BusinessTailorInformationIp;
