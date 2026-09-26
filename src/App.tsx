import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/Login';
import Tenants from './pages/Tenants';
import Settings from './pages/Settings';
import Subscriptions from './pages/Subscriptions';
import AccessControl from './pages/access-control/AccessControl';

import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/dashboard" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="tenants" element={<Tenants />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="themes" element={<div>Configurar Cores e White-label</div>} />
          <Route path="access" element={<AccessControl />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}


