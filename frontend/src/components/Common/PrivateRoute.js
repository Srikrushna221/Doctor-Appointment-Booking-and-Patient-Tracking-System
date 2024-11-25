// src/components/Common/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ component: Component }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  if (!isAuthenticated && !loading) {
    return <Navigate to="/" />;
  }

  return <Component />;
};

export default PrivateRoute;
