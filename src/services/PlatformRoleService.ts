import type { IHttpClient } from '../core/interfaces/IHttpClient';
import { LocalStorageKeys } from '../core/enums/LocalStorageKeys';

export class PlatformRoleService {
  constructor(private readonly httpClient: IHttpClient) {}

  async getAllRoles(): Promise<{ success: boolean; data?: any[]; message?: string }> {
    
    const response = await this.httpClient.get<any>(`/api/v1/platformroles`);
    
    if (response.isSuccess && response.body?.success) {
      return { success: true, data: response.body.data };
    }
    return { success: false, message: response.body?.message || 'Falha ao carregar roles' };
  }

  async createRole(data: any): Promise<{ success: boolean; message?: string }> {
    
    const response = await this.httpClient.post<any>(`/api/v1/platformroles`, data);
    
    if (response.isSuccess && response.body?.success) {
      return { success: true, message: response.body.message };
    }
    return { success: false, message: response.body?.message || 'Falha ao criar role' };
  }

  async deleteRole(id: string): Promise<{ success: boolean; message?: string }> {
    
    const response = await this.httpClient.delete<any>(`/api/v1/platformroles/${id}`);
    
    if (response.isSuccess && response.body?.success) {
      return { success: true, message: response.body.message };
    }
    return { success: false, message: response.body?.message || 'Falha ao remover role' };
  }
}



