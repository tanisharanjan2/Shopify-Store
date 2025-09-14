import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import API from '../api';
import { jwtDecode } from 'jwt-decode';

export default function DashboardLayout() {
  const [tenantInfo, setTenantInfo] = useState(null);
  const [overview, setOverview] = useState(null);
  const [eventSummary, setEventSummary] = useState(null);
  const [topCustomersChartData, setTopCustomersChartData] = useState([]);
  const [salesTrend, setSalesTrend] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('');
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    navigate('/login');
  }, [navigate]);

  // This function's ONLY job is to fetch and display data from our database.
  const fetchData = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      handleLogout();
      return;
    }

    try {
      if (!loadingMessage) setLoading(true);
      const headers = { 'Authorization': `Bearer ${token}` };

      const [tenantInfoRes, overviewRes, eventSummaryRes, salesTrendRes, topCustomersChartRes] = await Promise.all([
        API.get('/dashboard/tenant-info', { headers }),
        API.get('/dashboard/overview', { headers }),
        API.get('/dashboard/events-summary', { headers }),
        API.get('/dashboard/sales-trend', { headers }),
        API.get('/dashboard/top-customers-chart', { headers })
      ]);

      setTenantInfo(tenantInfoRes.data);
      setOverview(overviewRes.data);
      setEventSummary(eventSummaryRes.data);
      setSalesTrend(salesTrendRes.data);
      setTopCustomersChartData(topCustomersChartRes.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch dashboard data.');
      if (err.response?.status === 401) handleLogout();
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  }, [handleLogout, loadingMessage]);

  useEffect(() => {
    fetchData();
  }, []); // Run only once on initial mount

  

  // Handler for syncing LIVE data from Shopify
  const handleSyncShopify = async () => {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };

    try {
      setError('');
      setLoadingMessage('Connecting to Shopify...');
      
      setLoadingMessage('Syncing products...');
      await API.get('/shopify/sync/products', { headers });

      setLoadingMessage('Syncing customers...');
      await API.get('/shopify/sync/customers', { headers });

      setLoadingMessage('Syncing orders...');
      await API.get('/shopify/sync/orders', { headers });
      
      setLoadingMessage('Refreshing dashboard...');
      await fetchData();

    } catch (err) {
      setError('Failed to sync from Shopify. Check credentials and server logs.');
      console.error(err);
      setLoadingMessage('');
    }
  };

  // Handler for ingesting SAMPLE data
  const handleIngestSampleData = async () => {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    
    try {
      setLoadingMessage('Loading sample data...');
      setError('');

      
      const sampleProducts = [
{ shopifyId: 101, title: "Classic T-Shirt", price: "25.00" },
        { shopifyId: 102, title: "Denim Jeans", price: "75.00" },
        { shopifyId: 103, title: "Leather Belt", price: "35.00" },
        { shopifyId: 104, title: "Sunglasses", price: "55.00" },
        { shopifyId: 105, title: "Cozy Hoodie", price: "60.00" },
        { shopifyId: 106, title: "Knit Beanie", price: "20.00" },
      ];
      const sampleCustomers = [
        { shopifyId: 201, firstName: "Priya", lastName: "Sharma", email: "priya.s@example.com" },
        { shopifyId: 202, firstName: "Rohan", lastName: "Kumar", email: "rohan.k@example.com" },
        { shopifyId: 203, firstName: "Anjali", lastName: "Gupta", email: "anjali.g@example.com" },
        { shopifyId: 204, firstName: "Vikram", lastName: "Singh", email: "vikram.s@example.com" },
        { shopifyId: 205, firstName: "Sneha", lastName: "Patel", email: "sneha.p@example.com" },
        { shopifyId: 206, firstName: "Amit", lastName: "Verma", email: "amit.v@example.com" },
        { shopifyId: 207, firstName: "Deepika", lastName: "Reddy", email: "deepika.r@example.com" },
        { shopifyId: 208, firstName: "Sanjay", lastName: "Joshi", email: "sanjay.j@example.com" },
        { shopifyId: 209, firstName: "Neha", lastName: "Mehta", email: "neha.m@example.com" },
        { shopifyId: 210, firstName: "Rajesh", lastName: "Nair", email: "rajesh.n@example.com" },
        { shopifyId: 211, firstName: "Kiran", lastName: "Iyer", email: "kiran.i@example.com" },
        { shopifyId: 212, firstName: "Alok", lastName: "Chaudhary", email: "alok.c@example.com" },
        { shopifyId: 213, firstName: "Tanisha", lastName: "Ranjan", email: "tanisha.r@example.com" },
        { shopifyId: 214, firstName: "Ritika", lastName: "Sen", email: "ritika.s@example.com" },
        { shopifyId: 215, firstName: "Manish", lastName: "Gupta", email: "manish.g@example.com" },
      ];
      const sampleOrders = [
        { shopifyId: 1001, totalPrice: "100.00", createdAtShopify: "2025-09-10T10:00:00Z", customer: { id: 201 }, line_items: [{ product_id: 101, quantity: 1, price: "25.00" }, { product_id: 102, quantity: 1, price: "75.00" }] },
        { shopifyId: 1002, totalPrice: "50.00", createdAtShopify: "2025-09-09T15:30:00Z", customer: { id: 202 }, line_items: [{ product_id: 101, quantity: 2, price: "25.00" }] },
        { shopifyId: 1003, totalPrice: "90.00", createdAtShopify: "2025-09-08T11:00:00Z", customer: { id: 203 }, line_items: [{ product_id: 103, quantity: 1, price: "35.00" }, { product_id: 104, quantity: 1, price: "55.00" }] },
        { shopifyId: 1004, totalPrice: "150.00", createdAtShopify: "2025-09-07T18:45:00Z", customer: { id: 202 }, line_items: [{ product_id: 102, quantity: 2, price: "75.00" }] },
        { shopifyId: 1005, totalPrice: "80.00", createdAtShopify: "2025-09-06T12:00:00Z", customer: { id: 204 }, line_items: [{ product_id: 105, quantity: 1, price: "60.00" }, { product_id: 106, quantity: 1, price: "20.00" }] },
        { shopifyId: 1006, totalPrice: "25.00", createdAtShopify: "2025-09-05T09:20:00Z", customer: { id: 205 }, line_items: [{ product_id: 101, quantity: 1, price: "25.00" }] },
        { shopifyId: 1007, totalPrice: "135.00", createdAtShopify: "2025-09-04T14:55:00Z", customer: { id: 206 }, line_items: [{ product_id: 102, quantity: 1, price: "75.00" }, { product_id: 105, quantity: 1, price: "60.00" }] },
        { shopifyId: 1008, totalPrice: "75.00", createdAtShopify: "2025-09-03T20:10:00Z", customer: { id: 207 }, line_items: [{ product_id: 102, quantity: 1, price: "75.00" }] },
        { shopifyId: 1009, totalPrice: "115.00", createdAtShopify: "2025-09-02T13:00:00Z", customer: { id: 201 }, line_items: [{ product_id: 104, quantity: 1, price: "55.00" }, { product_id: 105, quantity: 1, price: "60.00" }] },
        { shopifyId: 1010, totalPrice: "40.00", createdAtShopify: "2025-09-01T16:00:00Z", customer: { id: 208 }, line_items: [{ product_id: 106, quantity: 2, price: "20.00" }] },
        { shopifyId: 1011, totalPrice: "60.00", createdAtShopify: "2025-08-31T10:00:00Z", customer: { id: 209 }, line_items: [{ product_id: 105, quantity: 1, price: "60.00" }] },
        { shopifyId: 1012, totalPrice: "55.00", createdAtShopify: "2025-08-30T11:40:00Z", customer: { id: 210 }, line_items: [{ product_id: 104, quantity: 1, price: "55.00" }] },
        { shopifyId: 1013, totalPrice: "95.00", createdAtShopify: "2025-08-29T17:00:00Z", customer: { id: 203 }, line_items: [{ product_id: 102, quantity: 1, price: "75.00" }, { product_id: 106, quantity: 1, price: "20.00" }] },
        { shopifyId: 1014, totalPrice: "120.00", createdAtShopify: "2025-08-28T19:00:00Z", customer: { id: 202 }, line_items: [{ product_id: 105, quantity: 2, price: "60.00" }] },
        { shopifyId: 1015, totalPrice: "35.00", createdAtShopify: "2025-08-27T08:00:00Z", customer: { id: 204 }, line_items: [{ product_id: 101, quantity: 1, price: "25.00" }] },
        { shopifyId: 1016, totalPrice: "85.00", createdAtShopify: "2025-08-26T15:20:00Z", customer: { id: 205 }, line_items: [{ product_id: 102, quantity: 1, price: "75.00" }] },
        { shopifyId: 1017, totalPrice: "70.00", createdAtShopify: "2025-08-25T12:10:00Z", customer: { id: 206 }, line_items: [{ product_id: 105, quantity: 1, price: "60.00" }] },
        { shopifyId: 1018, totalPrice: "50.00", createdAtShopify: "2025-08-24T09:30:00Z", customer: { id: 207 }, line_items: [{ product_id: 101, quantity: 2, price: "25.00" }] },
        { shopifyId: 1019, totalPrice: "110.00", createdAtShopify: "2025-08-23T14:00:00Z", customer: { id: 208 }, line_items: [{ product_id: 102, quantity: 1, price: "75.00" }, { product_id: 103, quantity: 1, price: "35.00" }] },
        { shopifyId: 1020, totalPrice: "65.00", createdAtShopify: "2025-08-22T11:50:00Z", customer: { id: 209 }, line_items: [{ product_id: 104, quantity: 1, price: "55.00" }, { product_id: 106, quantity: 1, price: "10.00" }] },
        { shopifyId: 1021, totalPrice: "95.00", createdAtShopify: "2025-08-21T16:40:00Z", customer: { id: 210 }, line_items: [{ product_id: 105, quantity: 1, price: "60.00" }, { product_id: 103, quantity: 1, price: "35.00" }] },
        { shopifyId: 1022, totalPrice: "45.00", createdAtShopify: "2025-08-20T10:20:00Z", customer: { id: 211 }, line_items: [{ product_id: 101, quantity: 1, price: "25.00" }, { product_id: 106, quantity: 1, price: "20.00" }] },
        { shopifyId: 1023, totalPrice: "75.00", createdAtShopify: "2025-08-19T18:30:00Z", customer: { id: 212 }, line_items: [{ product_id: 102, quantity: 1, price: "75.00" }] },
      ];

      await API.post('/ingest/products', sampleProducts, { headers });
      await API.post('/ingest/customers', sampleCustomers, { headers });
      await API.post('/ingest/orders', sampleOrders, { headers });
      
      await fetchData();
    } catch (err) {
      setError('Failed to ingest sample data.');
      console.error(err);
      setLoadingMessage('');
    }
  };
  
  // Handler for UNLOADING all data
  const handleUnloadData = async () => {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    try {
      setLoadingMessage('Clearing all data...');
      setError('');
      
      await API.delete('/ingest/tenant/all-data', { headers });

      await fetchData();

    } catch (err) { 
      setError('Failed to unload data.');
      console.error(err);
      setLoadingMessage('');
    }
  };

  if (loading && !loadingMessage) return <h2>Loading dashboard...</h2>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {tenantInfo?.logoUrl && (
            <img src={tenantInfo.logoUrl} alt={`${tenantInfo.name} Logo`} style={{ height: '50px', width: '50px', objectFit: 'contain' }} />
          )}
          <div>
            <h2 style={{ margin: 0 }}>{tenantInfo ? tenantInfo.name : 'Dashboard'}</h2>
            <p style={{ margin: '5px 0' }}>Owner: {tenantInfo?.adminEmail || '...'}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {overview && overview.totalCustomers > 0 && (
             <>
              
              <button onClick={handleUnloadData} disabled={!!loadingMessage} style={{ backgroundColor: '#dc3545', color: 'white' }}>
                Unload Data
              </button>
            </>
          )}
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {overview && overview.totalCustomers === 0 && (
        <div style={{ padding: '20px', margin: '20px 0', backgroundColor: '#eef', border: '1px solid #ccf', textAlign: 'center' }}>
          <h4>Your dashboard is empty!</h4>
          <p>Choose a data source to get started.</p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '20px' }}>
            <button onClick={handleIngestSampleData} disabled={!!loadingMessage}>
              Load Sample Data
            </button>
            <button onClick={handleSyncShopify} disabled={!!loadingMessage}>
              Sync from Shopify
            </button>
          </div>
          {loadingMessage && <p style={{ marginTop: '15px' }}>{loadingMessage}</p>}
        </div>
      )}
      
      {error && <div style={{ color: 'red', margin: '10px 0', textAlign: 'center' }}>{error}</div>}

      <nav style={{ margin: '40px 0', display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {['Overview', 'Sales Trend', 'Orders', 'Top Customers', 'Customer History'].map((page, i) => (
          <Link
            key={i}
            to={`/dashboard/${page.toLowerCase().replace(' ', '-')}`}
            style={{
              fontSize: '24px',
              fontWeight: '700',
              border: '1px solid #ddd',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              width: '250px',
              textDecoration: 'none',
              color: '#333',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              backgroundColor: '#749dc9ff',
            }}
          >
            {page}
          </Link>
        ))}
      </nav>

      {overview && overview.totalCustomers > 0 && (
        <Outlet context={{ overview, eventSummary, topCustomersChartData, salesTrend }} />
      )}
    </div>
  );
}