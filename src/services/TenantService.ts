import type { IHttpClient } from '../core/interfaces/IHttpClient';
import { ApiEndpoints } from '../constants/ApiEndpoints';
import type { TenantDTO } from '../core/interfaces/TenantDTO';
import type { CreateTenantRequest } from '../core/interfaces/CreateTenantRequest';

export class TenantService {
  constructor(private readonly httpClient: IHttpClient) {}

  async getAllTenants(): Promise<{ success: boolean; data?: TenantDTO[]; message?: string }> {
    const response = await this.httpClient.get<any>(
      `${ApiEndpoints.TENANTS}`
    );

    if (response.isSuccess && response.body?.success) {
      return { success: true, data: response.body.data };
    }

    return { success: false, message: response.body?.message || 'Falha ao carregar inquilinos' };
  }

  async createTenant(request: CreateTenantRequest): Promise<{ success: boolean; data?: TenantDTO; message?: string }> {
    const response = await this.httpClient.post<any>(
      `${ApiEndpoints.TENANTS}`,
      request
    );

    if (response.isSuccess && response.body?.success) {
      return { success: true, data: response.body.data };
    }

    return { success: false, message: response.body?.message || 'Falha ao criar inquilino' };
  }

  async toggleStatus(id: string): Promise<{ success: boolean; message?: string }> {
    const response = await this.httpClient.patch<any>(
      `${ApiEndpoints.TENANTS}/${id}/toggle-status`,
      {}
    );

    if (response.isSuccess && response.body?.success) {
      return { success: true, message: response.body.message };
    }
    return { success: false, message: response.body?.message || 'Falha ao alterar status' };
  }
}




