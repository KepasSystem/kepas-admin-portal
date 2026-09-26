export interface TenantDTO {
  id: string;
  name: string;
  subdomain: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  currentPlan?: string;
}

