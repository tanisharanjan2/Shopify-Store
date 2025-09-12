import React from 'react';
import { useOutletContext } from 'react-router-dom';
import backgroundImage from './img2.png.jpg';

export default function DashboardPage() {
  const { overview } = useOutletContext();

  // Create a safe version of overview to prevent errors before data loads
  const safeOverview = overview || { totalCustomers: 0, totalOrders: 0, revenue: 0 };

  return (
    <div style={pageStyle}>
        <h1 style={titleStyle}>Overview</h1>
        <div style={cardsContainerStyle}>
            <InteractiveCard title="Total Customers" value={safeOverview.totalCustomers} />
            <InteractiveCard title="Total Orders" value={safeOverview.totalOrders} />
            <InteractiveCard title="Revenue" value={`₹${parseFloat(safeOverview.revenue ?? 0).toFixed(2)}`} />
        </div>
    </div>
  );
}

// Card component
function InteractiveCard({ title, value }) {
  return (
    <div style={interactiveCardStyle}>
      <h2 style={labelStyle}>{title}</h2>
      <p style={valueStyle}>{value}</p>
    </div>
  );
}

// --- Styles ---
const pageStyle = {
  padding: '40px',
  minHeight: '100vh',
  background: `url(${backgroundImage}) no-repeat center center/cover, linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const titleStyle = {
  fontSize: '48px',
  marginBottom: '50px',
  color: '#222',
  textShadow: '2px 2px 8px rgba(0,0,0,0.1)',
};

const cardsContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '40px',
  flexWrap: 'wrap',
};

const interactiveCardStyle = {
  borderRadius: '16px',
  padding: '30px 40px',
  width: '260px',
  textAlign: 'center',
  backgroundColor: '#fff',
  boxShadow: '6px 6px 20px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
};

const labelStyle = {
  fontSize: '24px',
  marginBottom: '15px',
  fontWeight: '600',
  color: '#444',
};

const valueStyle = {
  fontSize: '36px',
  fontWeight: '700',
  color: '#007bff',
  margin: 0,
};