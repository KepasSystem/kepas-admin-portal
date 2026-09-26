import { LayoutDashboard, Users, CreditCard, Settings, Building2, PaintBucket, Briefcase } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface ISidebarItem {
  name: string;
  path: string;
  icon: LucideIcon;
}

export const ADMIN_SIDEBAR_ITEMS: ISidebarItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Contas de Serviço', path: '/dashboard/service-accounts', icon: Briefcase },
  { name: 'Inquilinos (Tenants)', path: '/dashboard/tenants', icon: Building2 },
  { name: 'Assinaturas Globais', path: '/dashboard/subscriptions', icon: CreditCard },
  { name: 'Personalização', path: '/dashboard/themes', icon: PaintBucket },
  { name: 'Controle de Acessos', path: '/dashboard/access', icon: Users },
  { name: 'Configurações', path: '/dashboard/settings', icon: Settings },
];
