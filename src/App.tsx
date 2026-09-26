import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/guards/ProtectedRoute';
import Login from './pages/Login';
import Tenants from './pages/Tenants';
import Settings from './pages/Settings';
import Subscriptions from './pages/Subscriptions';
import AccessControl from './pages/access-control/AccessControl';
import ServiceAccounts from './pages/ServiceAccounts';

import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Rotas Protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="service-accounts" element={<ServiceAccounts />} />
            <Route path="tenants" element={<Tenants />} />
            <Route path="subscriptions" element={<Subscriptions />} />
            <Route path="themes" element={<div>Configurar Cores e White-label</div>} />
            <Route path="access" element={<AccessControl />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}


