import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { PaintBucket } from 'lucide-react';
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
            <Route path="themes" element={<div className="flex flex-col items-center justify-center h-[80vh] text-gray-500"><PaintBucket className="w-16 h-16 mb-4 text-gray-300" /><h2 className="text-xl font-bold text-gray-700">Personalização (Em Breve)</h2><p>As configurações de cores e white-label serão disponibilizadas na próxima versão.</p></div>} />
            <Route path="access" element={<AccessControl />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}


