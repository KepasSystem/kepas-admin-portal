import { LocalStorageKeys } from '../core/enums/LocalStorageKeys';
import type { IHttpClient } from '../core/interfaces/IHttpClient';
import { ApiEndpoints } from '../constants/ApiEndpoints';
import type { TenantDTO } from '../core/interfaces/TenantDTO';
import type { CreateTenantRequest } from '../core/interfaces/CreateTenantRequest';

export class TenantService {
  constructor(private readonly httpClient: IHttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem(LocalStorageKeys.ADMIN_TOKEN);
    const tokenType = localStorage.getItem(LocalStorageKeys.ADMIN_TOKEN_TYPE) || 'Bearer';
    return {
      Authorization: `${tokenType} ${token}`,
    };
  }

  async getAllTenants(): Promise<{ success: boolean; data?: TenantDTO[]; message?: string }> {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    
    const response = await this.httpClient.get<any>(
      `${apiUrl}${ApiEndpoints.TENANTS}`, 
      this.getAuthHeaders()
    );

    if (response.isSuccess && response.body?.success) {
      return { success: true, data: response.body.data };
    }

    return { success: false, message: response.body?.message || 'Falha ao carregar inquilinos' };
  }

  async createTenant(request: CreateTenantRequest): Promise<{ success: boolean; data?: TenantDTO; message?: string }> {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    
    const response = await this.httpClient.post<any>(
      `${apiUrl}${ApiEndpoints.TENANTS}`,
      request,
      this.getAuthHeaders()
    );

    if (response.isSuccess && response.body?.success) {
      return { success: true, data: response.body.data };
    }

    return { success: false, message: response.body?.message || 'Falha ao criar inquilino' };
  }
}



