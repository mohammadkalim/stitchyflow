import React from 'react';
import BusinessCrudPage from './BusinessCrudPage';

function TailerVerifications() {
  return (
    <BusinessCrudPage
      title="Tailer Verifications"
      resource="verifications"
      idKey="verification_id"
      defaultForm={{ tailor_name: '', shop_name: '', cnic_number: '', contact_number: '', verification_status: 'pending', review_notes: '' }}
      columns={[
        { key: 'verification_id', label: 'ID', readOnly: true },
        { key: 'tailor_name', label: 'Tailor Name' },
        { key: 'shop_name', label: 'Shop Name' },
        { key: 'cnic_number', label: 'CNIC Number' },
        { key: 'contact_number', label: 'Contact Number' },
        { key: 'verification_status', label: 'Status', options: ['pending', 'approved', 'rejected'] },
        { key: 'review_notes', label: 'Review Notes' }
      ]}
    />
  );
}

export default TailerVerifications;
