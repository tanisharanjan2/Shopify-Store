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
          await API.get('/shopify/sync/orders', { headers });
        }

        
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
  }, [dataSource]); 

  if (loading) return <h3>Loading Sales Trend...</h3>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="widget">
      <h3>Sales Trend (Last 30 Days)</h3>
      <SalesTrendChart data={salesTrend} />
    </div>
  );
}