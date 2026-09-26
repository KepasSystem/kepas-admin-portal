import { DI } from '../../../../core/di/DependencyInjection';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Modal } from '../../../../components/ui/Modal';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';

const service = DI.resolve<any>('IPlatformRoleService');

const schema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  permissions: z.array(z.string()).min(1, 'Selecione pelo menos uma permissão')
});

type FormData = z.infer<typeof schema>;

const AVAILABLE_PERMISSIONS = [
  { id: 'Tenants:Read', label: 'Ver Inquilinos' },
  { id: 'Tenants:Write', label: 'Editar Inquilinos' },
  { id: 'Tenants:Delete', label: 'Remover Inquilinos' },
  { id: 'Subscriptions:Read', label: 'Ver Assinaturas' },
  { id: 'AccessControl:Write', label: 'Gerenciar Acessos' },
  { id: 'Settings:Write', label: 'Configurações Globais' }
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateRoleModal({ isOpen, onClose }: Props) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  
  const { control, handleSubmit, register, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      permissions: []
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const payload = {
        name: data.name,
        permissions: data.permissions.map(p => {
          const [resource, action] = p.split(':');
          return { resource, action };
        })
      };
      const result = await service.createRole(payload as any);
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: () => {
      toast.success('Cargo criado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['platform-roles'] });
      reset();
      onClose();
    },
    onError: (err: any) => {
      toast.error(err.message || 'Erro ao criar cargo');
    }
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('accessControl.roles.newRole')}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
        <Input 
          label="Nome do Cargo"
          placeholder="Ex: Suporte Financeiro"
          {...register('name')}
          error={errors.name?.message}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Permissões
          </label>
          <div className="space-y-2 max-h-60 overflow-y-auto p-2 border border-gray-200 rounded-lg">
            {AVAILABLE_PERMISSIONS.map(perm => (
              <label key={perm.id} className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox"
                  value={perm.id}
                  {...register('permissions')}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{perm.label}</span>
              </label>
            ))}
          </div>
          {errors.permissions && (
            <p className="text-sm text-red-600 mt-1">{errors.permissions.message}</p>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={mutation.isPending}>
            Criar Cargo
          </Button>
        </div>
      </form>
    </Modal>
  );
}

