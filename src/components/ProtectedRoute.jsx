import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component }) => {
  const token = localStorage.getItem('accessToken');

  return token ? Component : <Navigate to="/" replace />;
};

export default ProtectedRoute;

