import { DI } from '../../../../core/di/DependencyInjection';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Modal } from '../../../../components/ui/Modal';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';

const adminService = DI.getPlatformAdminService();
const roleService = DI.getPlatformRoleService();

const schema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  platformRoleId: z.string().optional()
});

type FormData = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateAdminModal({ isOpen, onClose }: Props) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  
  // Buscar lista de Cargos em cache para o dropdown
  const { data: roles = [], isLoading: isLoadingRoles } = useQuery({
    queryKey: ['platform-roles'],
    queryFn: async () => {
      const res = await roleService.getAllRoles();
      return res.data || [];
    },
    enabled: isOpen // Só busca quando o modal abre
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      platformRoleId: ''
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const result = await adminService.createAdmin({
        ...data,
        platformRoleId: data.platformRoleId ? data.platformRoleId : undefined
      });
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: () => {
      toast.success('Administrador criado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['platform-admins'] });
      reset();
      onClose();
    },
    onError: (err: any) => {
      toast.error(err.message || 'Erro ao criar administrador');
    }
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('accessControl.admins.newAdmin')}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <Input 
          label="Nome Completo"
          placeholder="Ex: João Silva"
          {...register('name')}
          error={errors.name?.message}
        />
        
        <Input 
          type="email"
          label="E-mail Institucional"
          placeholder="Ex: joao@kepas.com"
          {...register('email')}
          error={errors.email?.message}
        />

        <Input 
          type="password"
          label="Senha de Acesso Temporária"
          placeholder="******"
          {...register('password')}
          error={errors.password?.message}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vincular Cargo (Opcional)
          </label>
          <select 
            {...register('platformRoleId')}
            disabled={isLoadingRoles}
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
          >
            <option value="">Selecione um Cargo</option>
            {roles.map((r: any) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
          {isLoadingRoles && <p className="text-xs text-blue-600 mt-1">Carregando cargos...</p>}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={mutation.isPending}>
            Criar Usuário
          </Button>
        </div>
      </form>
    </Modal>
  );
}

