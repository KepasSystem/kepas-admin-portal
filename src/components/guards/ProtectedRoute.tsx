import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { LocalStorageKeys } from '../../core/enums/LocalStorageKeys';

export default function ProtectedRoute() {
  const token = localStorage.getItem(LocalStorageKeys.ADMIN_TOKEN);
  const location = useLocation();

  if (!token) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
