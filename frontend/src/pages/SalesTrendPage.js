import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import SalesTrendChart from '../components/SalesTrendChart';
import API from '../api';

export default function SalesTrendPage() {
  const { dataSource } = useOutletContext();
  const [salesTrend, setSalesTrend] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        if (dataSource === 'shopify') {
          // Step 1: Ensure data is up-to-date by telling the backend to sync.
          await API.get('/shopify/sync/orders', { headers });
        }

        // Step 2: Fetch the final, pre-calculated trend data from our backend.
        // This one endpoint works for BOTH sample and Shopify data.
        const res = await API.get('/dashboard/sales-trend', { headers });
        setSalesTrend(res.data || []);

      } catch (err) {
        console.error('Failed to fetch sales trend:', err);
        setError('Could not load sales trend data.');
        setSalesTrend([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataSource]); // Re-run when the data source changes

  if (loading) return <h3>Loading Sales Trend...</h3>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="widget">
      <h3>Sales Trend (Last 30 Days)</h3>
      <SalesTrendChart data={salesTrend} />
    </div>
  );
}