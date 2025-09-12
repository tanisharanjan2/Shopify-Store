import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // Check if a token exists in local storage
  const token = localStorage.getItem('token');

  // If there is no token, redirect the user to the /login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If there is a token, render the protected page
  return <>{children}</>;
};

export default PrivateRoute;
