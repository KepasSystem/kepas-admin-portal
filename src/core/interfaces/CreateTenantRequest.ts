export interface CreateTenantRequest {
  name: string;
  subdomain: string;
  email: string;
  ownerName?: string;
  ownerPassword?: string;
}

