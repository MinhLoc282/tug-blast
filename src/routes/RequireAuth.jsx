import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../screens/auth';

export function RequieAuth({ children }) {
  const location = useLocation();
  const auth = useAuth();
  if (!auth.user) {
    return <Navigate to="/signin" state={{ path: location.pathname }} />;
  }
  return children;
}
