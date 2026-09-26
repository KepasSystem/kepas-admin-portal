import { DI } from '../core/di/DependencyInjection';
import React, { useState, useMemo } from 'react';
import { Search, Plus, Filter, MoreHorizontal, Edit, Eye, Ban, CheckCircle, AlertCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { TenantDTO } from '../core/interfaces/TenantDTO';
import { TenantService } from '../services/TenantService';
import { AxiosHttpClient } from '../infrastructure/http/AxiosHttpClient';
import CreateTenantModal from '../components/modals/CreateTenantModal';
import ConfirmModal from '../components/modals/ConfirmModal';
import type { CreateTenantRequest } from '../core/interfaces/CreateTenantRequest';
import { showToast } from '../core/utils/toastUtils';

export default function Tenants() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, tenantId: string, currentStatus: boolean}>({
    isOpen: false,
    tenantId: '',
    currentStatus: false
  });
  
  const queryClient = useQueryClient();
  const tenantService = useMemo(() => DI.resolve<any>('ITenantService'), []);

  const { data: tenants = [], isLoading, error } = useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      const response = await tenantService.getAllTenants();
      if (!response.success) throw new Error(response.message);
      return response.data || [];
    }
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateTenantRequest) => tenantService.createTenant(data),
    onSuccess: (response) => {
      if (response.success) {
        showToast.success('Inquilino criado com sucesso!');
        setIsModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ['tenants'] });
      } else {
        showToast.error(response.message || 'Erro ao criar inquilino');
      }
    },
    onError: (err: any) => {
      showToast.error(err.message || 'Erro fatal');
    }
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (id: string) => tenantService.toggleStatus(id),
    onSuccess: (response) => {
      if (response.success) {
        showToast.success(response.message || 'Status alterado com sucesso', 'Ação Concluída');
        queryClient.invalidateQueries({ queryKey: ['tenants'] });
      } else {
        showToast.error(response.message || 'Erro ao alterar status', 'Falha');
      }
    },
    onError: (err: any) => {
      showToast.error(err.message || 'Erro de rede ao alterar status');
    }
  });

  const handleCreateTenant = (data: CreateTenantRequest) => {
    createMutation.mutate(data);
  };

  const openToggleConfirm = (id: string, currentStatus: boolean) => {
    setConfirmModal({ isOpen: true, tenantId: id, currentStatus });
  };

  const handleToggleConfirm = () => {
    toggleStatusMutation.mutate(confirmModal.tenantId);
    setConfirmModal({ isOpen: false, tenantId: '', currentStatus: false });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestão de Clientes (Tenants)</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie os inquilinos, status e permissões da plataforma.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Cliente
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 text-red-700 p-4 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error instanceof Error ? error.message : 'Erro de conexão'}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1 flex flex-col">
        
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              disabled
              placeholder="Buscar por nome ou subdomínio..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100"
            />
          </div>
          
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto justify-center">
              <Filter className="w-4 h-4 mr-2 text-gray-500" />
              Status: Todos
            </button>
          </div>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Empresa / Contato
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Subdomínio
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Plano Atual
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    Carregando inquilinos...
                  </td>
                </tr>
              ) : tenants.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    Nenhum inquilino encontrado. Clique em Novo Cliente.
                  </td>
                </tr>
              ) : (
                tenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-md bg-gray-100 flex items-center justify-center text-gray-500 font-bold uppercase">
                          {tenant.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">{tenant.name}</div>
                          <div className="text-sm text-gray-500">{tenant.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-mono bg-gray-100 inline-block px-2 py-1 rounded">
                        {tenant.subdomain}.kepas.com
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                        {tenant.currentPlan || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        tenant.isActive
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {tenant.isActive ? 'Ativo' : 'Bloqueado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        <button className="text-gray-400 hover:text-blue-600 transition-colors" title="Ver Detalhes">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button className="text-gray-400 hover:text-green-600 transition-colors" title="Editar Dados">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openToggleConfirm(tenant.id, tenant.isActive)}
                          disabled={toggleStatusMutation.isPending}
                          className={`transition-colors ${tenant.isActive ? 'text-gray-400 hover:text-red-600' : 'text-red-500 hover:text-green-600'}`} 
                          title={tenant.isActive ? "Suspender Conta" : "Ativar Conta"}
                        >
                          {tenant.isActive ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/*
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Mostrando <span className="font-medium">{tenants.length > 0 ? 1 : 0}</span> a <span className="font-medium">{tenants.length}</span> de <span className="font-medium">{tenants.length}</span> inquilinos
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 bg-gray-50 cursor-not-allowed">Anterior</button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 bg-gray-50 cursor-not-allowed">Próxima</button>
          </div>
        </div>
        */}
      </div>
      
      <CreateTenantModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTenant}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.currentStatus ? "Suspender Inquilino" : "Ativar Inquilino"}
        message={`Tem certeza que deseja ${confirmModal.currentStatus ? 'suspender' : 'ativar'} este inquilino? ${confirmModal.currentStatus ? 'Os usuários vinculados perderão o acesso.' : ''}`}
        type={confirmModal.currentStatus ? "warning" : "info"}
        confirmText={confirmModal.currentStatus ? "Suspender" : "Ativar"}
        onConfirm={handleToggleConfirm}
        onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
      />
    </div>
  );
}

