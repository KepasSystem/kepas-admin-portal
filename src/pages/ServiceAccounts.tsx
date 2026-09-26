import { useAppTranslation } from '../core/i18n/useAppTranslation';
import { TKeys } from '../core/i18n/TranslationKeys';
﻿import { DI } from '../core/di/DependencyInjection';
import React, { useState, useMemo } from 'react';
import { Search, Plus, Filter, Edit, Eye, Building, Users } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ServiceAccountService } from '../services/ServiceAccountService';
import { AxiosHttpClient } from '../infrastructure/http/AxiosHttpClient';
import { showToast } from '../core/utils/toastUtils';
import CreateServiceAccountModal from '../components/modals/CreateServiceAccountModal';

export default function ServiceAccounts() {
  const { t } = useAppTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const serviceAccountService = useMemo(() => DI.resolve<any>('IServiceAccountService'), []);

  const { data: accounts = [], isLoading, error } = useQuery({
    queryKey: ['serviceAccounts'],
    queryFn: async () => {
      const response = await serviceAccountService.getAllAccounts();
      if (!response.success) throw new Error(response.message);
      return response.data || [];
    }
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => serviceAccountService.createAccount(data),
    onSuccess: (response) => {
      if (response.success) {
        showToast.success('Conta de serviÃ§o criada com sucesso!');
        setIsModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ['serviceAccounts'] });
      } else {
        showToast.error(response.message || 'Erro ao criar conta');
      }
    },
    onError: (err: any) => {
      showToast.error(err.message || 'Erro fatal');
    }
  });

  const handleCreateAccount = async (data: any) => {
    createMutation.mutate(data);
  };

  if (error) {
    return <div className="p-4 text-red-500">Erro ao carregar contas.</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t(TKeys.ServiceAccounts.Title)}</h1>
          <p className="text-sm text-gray-500 mt-1">{t(TKeys.ServiceAccounts.Subtitle)}</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          {t(TKeys.ServiceAccounts.NewAccount)}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={t(TKeys.Common.Search)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
              disabled
            />
          </div>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t(TKeys.ServiceAccounts.Columns.Owner)}</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">{t(TKeys.ServiceAccounts.Columns.TenantsCount)}</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">{t(TKeys.ServiceAccounts.Columns.SubscriptionsCount)}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t(TKeys.ServiceAccounts.Columns.Created)}</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">{t(TKeys.Common.Actions)}</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    {t(TKeys.ServiceAccounts.Loading)}
                  </td>
                </tr>
              ) : accounts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    {t(TKeys.ServiceAccounts.EmptyState)}
                  </td>
                </tr>
              ) : (
                accounts.map((acc: any) => (
                  <tr key={acc.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-md bg-blue-100 flex items-center justify-center text-blue-600 font-bold uppercase">
                          <Building className="w-5 h-5" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">{acc.ownerName}</div>
                          <div className="text-sm text-gray-500">{acc.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        {acc.totalTenants}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        {acc.totalSubscriptions}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(acc.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        <button className="text-gray-400 hover:text-blue-600 transition-colors" title="Ver Detalhes">
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {t(TKeys.Common.ShowingOf)} <span className="font-medium">{accounts.length}</span> / <span className="font-medium">{data?.totalCount || 0}</span>
          </div>
          <div className="flex space-x-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-50">{t(TKeys.Common.Previous)}</button>
            <span className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 bg-white">Página {page}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={!data || data.pageNumber * data.pageSize >= data.totalCount} className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-50">{t(TKeys.Common.Next)}</button>
          </div>
        </div>


      <CreateServiceAccountModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateAccount}
      />
    </div>
  );
}

