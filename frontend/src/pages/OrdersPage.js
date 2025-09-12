import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import API from '../api';

export default function OrdersPage() {
  const { dataSource } = useOutletContext();
  const [orders, setOrders] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Refetch orders whenever the global data source changes
    fetchOrders();
  }, [dataSource]);

  const fetchOrders = async (from, to) => {
    try {
      setError('');
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      let ordersData = [];
      const params = new URLSearchParams();
      if (from) params.append('from', from);
      if (to) params.append('to', to);

      if (dataSource === 'shopify') {
        // --- FIXED: First sync the data, THEN fetch it from our database ---
        // Step 1: Tell the backend to sync the latest orders from Shopify.
        await API.get('/shopify/sync/orders', { headers });
      }

      // Step 2: Now, fetch the clean, formatted orders from our own database for BOTH sources.
      const res = await API.get(`/dashboard/orders?${params.toString()}`, { headers });
      ordersData = res.data.orders || [];

      setOrders(ordersData);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterOrders = () => {
    fetchOrders(startDate, endDate);
  };

  return (
    <div className="widget">
      <h3>Orders by Date</h3>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <label>From:</label>
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        <label>To:</label>
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        <button onClick={handleFilterOrders}>Filter</button>
      </div>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      {loading && <div>Loading orders...</div>}
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer Name</th>
            <th>Products</th>
            <th>Total Price</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>No orders found</td>
            </tr>
          ) : (
            orders.map(order => (
              <tr key={order.id}>
                <td>{order.shopifyId}</td>
                {/* Now this will work for Shopify data too */}
                <td>{order.Customer?.firstName || 'N/A'} {order.Customer?.lastName || ''}</td>
                <td>{(order.Products || []).map(p => p.title).join(', ')}</td>
                <td>₹{parseFloat(order.totalPrice || 0).toFixed(2)}</td>
                <td>{order.createdAtShopify ? new Date(order.createdAtShopify).toLocaleDateString() : 'N/A'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}