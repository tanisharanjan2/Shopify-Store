import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';
import { jwtDecode } from 'jwt-decode';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await API.post('/auth/login', { email, password });

      if (response.data.token) {
        // ✅ Store JWT token
        localStorage.setItem('token', response.data.token);

        // ✅ Decode tenantId from JWT and store
        const decoded = jwtDecode(response.data.token);
        localStorage.setItem('tenantId', decoded.tenantId);

        // ✅ Optionally store tenant info from login response
        localStorage.setItem('tenantName', response.data.tenant.name);
        localStorage.setItem('storeDomain', response.data.tenant.storeDomain);

        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: 'auto', padding: '20px' }}>
      <h1
        style={{
          fontSize: '48px',
          fontWeight: 'bold',
          marginBottom: '20px',
          color: '#e02020e3'
        }}
      >
        Storefy
      </h1>

      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <input
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit" style={{ width: '100%', padding: 10 }}>
          Login
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <hr style={{ margin: '20px 0' }} />
      <p>
        Don't have an account? <Link to="/signup">Sign up here</Link>
      </p>
    </div>
  );
}
