import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardLayout from './components/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import SalesTrendPage from './pages/SalesTrendPage';
import OrdersPage from './pages/OrdersPage';
import TopCustomersPage from './pages/TopCustomersPage';
import CustomerHistoryPage from './pages/CustomerHistoryPage';
import ProtectedRoute from './components/PrivateRoute'; // fixed import path
import bgImage from './image.png';

const pageStyle = {
  background: `url(${bgImage}) no-repeat center center fixed`,
  backgroundSize: 'cover',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<div style={pageStyle}><LoginPage /></div>} />
        <Route path="/signup" element={<div style={pageStyle}><SignupPage /></div>} />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          {/* Default Overview page */}
          <Route index element={<DashboardPage />} />
          <Route path="sales-trend" element={<SalesTrendPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="top-customers" element={<TopCustomersPage />} />
          <Route path="customer-history" element={<CustomerHistoryPage />} />
        </Route>

        {/* Root redirect */}
        <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
