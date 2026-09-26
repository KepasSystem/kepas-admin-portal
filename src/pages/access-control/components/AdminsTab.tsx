import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { PlatformAdminService } from '../../../services/PlatformAdminService';
import { AxiosHttpClient } from '../../../infrastructure/http/AxiosHttpClient';
import { Users, Plus, Shield, Power, Loader2 } from 'lucide-react';
import { CreateAdminModal } from './modals/CreateAdminModal';

const service = new PlatformAdminService(new AxiosHttpClient());

export default function AdminsTab() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: admins = [], isLoading } = useQuery({
    queryKey: ['platform-admins'],
    queryFn: async () => {
      const res = await service.getAllAdmins();
      if (!res.success) throw new Error(res.message);
      return res.data || [];
    }
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, currentStatus }: { id: string; currentStatus: boolean }) => 
      service.toggleStatus(id, !currentStatus),
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Status atualizado');
        queryClient.invalidateQueries({ queryKey: ['platform-admins'] });
      } else {
        toast.error(result.message);
      }
    },
    onError: () => toast.error('Erro ao atualizar status')
  });

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    toggleMutation.mutate({ id, currentStatus });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">{t('accessControl.tabs.admins')}</h3>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('accessControl.admins.newAdmin')}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center p-12 text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            {t('accessControl.admins.loading')}
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('accessControl.admins.columns.user')}</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('accessControl.admins.columns.role')}</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('accessControl.admins.columns.status')}</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('accessControl.admins.columns.actions')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {admins.map((admin: any) => (
                <tr key={admin.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                        <div className="text-sm text-gray-500">{admin.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Shield className="w-4 h-4 mr-2 text-gray-400" />
                      {admin.role?.name || t('accessControl.admins.noRole')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${admin.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {admin.isActive ? t('accessControl.admins.status.active') : t('accessControl.admins.status.blocked')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleToggleStatus(admin.id, admin.isActive)}
                      disabled={toggleMutation.isPending}
                      className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${admin.isActive ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}
                      title={admin.isActive ? t('accessControl.admins.tooltips.block') : t('accessControl.admins.tooltips.unblock')}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <CreateAdminModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

