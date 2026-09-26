import { DI } from '../../../core/di/DependencyInjection';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Shield, Plus, Trash2, Loader2 } from 'lucide-react';
import { CreateRoleModal } from './modals/CreateRoleModal';

const service = DI.getPlatformRoleService();

export default function RolesTab() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: roles = [], isLoading } = useQuery({
    queryKey: ['platform-roles'],
    queryFn: async () => {
      const res = await service.getAllRoles();
      if (!res.success) throw new Error(res.message);
      return res.data || [];
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => service.deleteRole(id),
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Cargo removido');
        queryClient.invalidateQueries({ queryKey: ['platform-roles'] });
      } else {
        toast.error(result.message);
      }
    },
    onError: () => toast.error('Erro ao remover')
  });

  const handleDelete = (id: string) => {
    if (window.confirm(t('accessControl.roles.confirmDelete'))) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">{t('accessControl.tabs.roles')}</h3>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('accessControl.roles.newRole')}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center p-12 text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            {t('accessControl.roles.loading')}
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('accessControl.roles.columns.role')}</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('accessControl.roles.columns.permissions')}</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('accessControl.roles.columns.actions')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {roles.map((role: any) => (
                <tr key={role.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Shield className="w-5 h-5 text-gray-400 mr-3" />
                      <div className="text-sm font-medium text-gray-900">{role.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {role.permissions?.map((p: any, idx: number) => (
                        <span key={`${p.id || idx}`} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {p.resource}:{p.action}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleDelete(role.id)}
                      disabled={deleteMutation.isPending}
                      className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <CreateRoleModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}

