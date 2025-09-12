import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import API from '../api';

export default function CustomerHistoryPage() {
  const { dataSource } = useOutletContext();
  const [customerHistory, setCustomerHistory] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCustomerHistory();
  }, [dataSource]);

  const fetchCustomerHistory = async (from, to) => {
    try {
      setError('');
      setLoading(true);

      if (dataSource === 'shopify') {
        const [customersRes, ordersRes] = await Promise.all([
          API.get('/shopify/sync/customers'),
          API.get('/shopify/sync/orders')
        ]);

        const customers = customersRes.data.data;
        const orders = ordersRes.data.data;

        const history = customers.map(c => {
          const customerOrders = orders.filter(o => o.customer?.id === c.id);
          const totalSpent = customerOrders.reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0);
          const lastOrder = customerOrders.length > 0
            ? new Date(customerOrders[customerOrders.length - 1].created_at)
            : null;

          return {
            id: c.id,
            name: `${c.first_name} ${c.last_name}`,
            Orders: customerOrders.map(o => ({
              shopifyId: o.id,
              totalPrice: o.total_price,
              createdAtShopify: o.created_at
            })),
            totalSpent,
            lastOrder
          };
        });

        setCustomerHistory(history);
      } else {
        const params = new URLSearchParams();
        if (from) params.append('from', from);
        if (to) params.append('to', to);
        const res = await API.get(`/dashboard/customer-history?${params.toString()}`);
        setCustomerHistory(res.data.customerHistory || []);
      }
    } catch (err) {
      console.error('API fetch error:', err.response || err);
      setError('Failed to fetch customer history.');
      setCustomerHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterHistory = () => {
    fetchCustomerHistory(startDate, endDate);
  };

  return (
    <div className="widget">
      <h3>Customer History</h3>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <label>From:</label>
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        <label>To:</label>
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        <button onClick={handleFilterHistory}>Filter</button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      {loading && <div>Loading customer history...</div>}

      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Orders</th>
            <th>Total Spent</th>
            <th>Last Order Date</th>
          </tr>
        </thead>
        <tbody>
          {customerHistory.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>No customer history found</td>
            </tr>
          ) : (
            customerHistory.map(customer => (
              <tr key={customer.id}>
                <td>{customer.name}</td>
                <td>{(customer.Orders || []).map(o => o.shopifyId).join(', ')}</td>
                <td>₹{((customer.Orders || []).reduce((sum, o) => sum + parseFloat(o.totalPrice || 0), 0)).toFixed(2)}</td>
                <td>
                  {(customer.Orders || []).length > 0
                    ? new Date(customer.Orders[customer.Orders.length - 1].createdAtShopify).toLocaleDateString()
                    : 'N/A'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
