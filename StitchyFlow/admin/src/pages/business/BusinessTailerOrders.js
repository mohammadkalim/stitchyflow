import React from 'react';
import BusinessCrudPage from './BusinessCrudPage';

function BusinessTailerOrders() {
  return (
    <BusinessCrudPage
      title="Business Tailer Orders"
      resource="orders"
      idKey="business_order_id"
      defaultForm={{ order_number: '', tailor_name: '', customer_name: '', garment_type: '', order_status: 'pending', total_amount: 0, due_date: '' }}
      columns={[
        { key: 'business_order_id', label: 'ID', readOnly: true },
        { key: 'order_number', label: 'Order Number' },
        { key: 'tailor_name', label: 'Tailor Name' },
        { key: 'customer_name', label: 'Customer Name' },
        { key: 'garment_type', label: 'Garment Type' },
        { key: 'order_status', label: 'Status', options: ['pending', 'in_progress', 'completed', 'cancelled'] },
        { key: 'total_amount', label: 'Total Amount' },
        { key: 'due_date', label: 'Due Date' }
      ]}
    />
  );
}

export default BusinessTailerOrders;
