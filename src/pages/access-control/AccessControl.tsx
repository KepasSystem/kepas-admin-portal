import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import RolesTab from './components/RolesTab';
import AdminsTab from './components/AdminsTab';

export default function AccessControl() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'roles' | 'admins'>('roles');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('accessControl.title')}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {t('accessControl.subtitle')}
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('roles')}
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'roles'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('accessControl.tabs.roles')}
            </button>
            <button
              onClick={() => setActiveTab('admins')}
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'admins'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('accessControl.tabs.admins')}
            </button>
          </nav>
        </div>
        
        <div className="p-6 bg-gray-50">
          {activeTab === 'roles' ? <RolesTab /> : <AdminsTab />}
        </div>
      </div>
    </div>
  );
}

