import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [storeUrl, setStoreUrl] = useState('');
  const [storeDomain, setStoreDomain] = useState(''); 
  const [accessToken, setAccessToken] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.post('/auth/signup', { 
        name, storeUrl, storeDomain, accessToken, email, password 
      });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.msg || 'Signup failed. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: 'auto', padding: '20px' }}>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
          placeholder="Store Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br />
        <input
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
          placeholder="Store URL (e.g., nike.com)"
          value={storeUrl}
          onChange={(e) => setStoreUrl(e.target.value)}
          required
        />
        <br />
        <input
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
          placeholder="Shopify Store Domain (e.g., shopify26.shopify.com)"
          value={storeDomain}
          onChange={(e) => setStoreDomain(e.target.value)}
          required
        />
        <br />
        <input
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
          placeholder="Shopify Access Token"
          value={accessToken}
          onChange={(e) => setAccessToken(e.target.value)}
          required
        />
        <br />
        <input
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
          type="email"
          placeholder="Admin Email"
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
        <button type="submit" style={{ width: '100%', padding: 10 }}>Signup</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <hr style={{ margin: '20px 0' }} />
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}
