import type { IHttpClient } from '../core/interfaces/IHttpClient';
import { LocalStorageKeys } from '../core/enums/LocalStorageKeys';

export class PlatformAdminService {
  constructor(private readonly httpClient: IHttpClient) {}

  async getAllAdmins(): Promise<{ success: boolean; data?: any[]; message?: string }> {
    
    const response = await this.httpClient.get<any>(`/api/v1/platformadmins`);
    
    if (response.isSuccess && response.body?.success) {
      return { success: true, data: response.body.data };
    }
    return { success: false, message: response.body?.message || 'Falha ao carregar admins' };
  }

  async createAdmin(data: any): Promise<{ success: boolean; message?: string }> {
    
    const response = await this.httpClient.post<any>(`/api/v1/platformadmins`, data);
    
    if (response.isSuccess && response.body?.success) {
      return { success: true, message: response.body.message };
    }
    return { success: false, message: response.body?.message || 'Falha ao criar admin' };
  }

  async toggleStatus(id: string, isActive: boolean): Promise<{ success: boolean; message?: string }> {
    
    const response = await this.httpClient.patch<any>(`/api/v1/platformadmins/${id}/toggle-status`, isActive, {
      'Content-Type': 'application/json'
    });
    
    if (response.isSuccess && response.body?.success) {
      return { success: true, message: response.body.message };
    }
    return { success: false, message: response.body?.message || 'Falha ao alterar status' };
  }
}



