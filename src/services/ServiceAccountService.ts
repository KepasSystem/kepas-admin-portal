import { AxiosHttpClient } from '../infrastructure/http/AxiosHttpClient';
import type { ServiceAccountDTO } from '../core/interfaces/ServiceAccountDTO';

export class ServiceAccountService {
  constructor(private httpClient: AxiosHttpClient) {}

  async getAllAccounts(search: string = '', page: number = 1, limit: number = 10): Promise<{ success: boolean; data?: { items: ServiceAccountDTO[], totalCount: number, pageNumber: number, pageSize: number }; message?: string }> {
    const query = new URLSearchParams({ search, page: page.toString(), limit: limit.toString() }).toString();
    const response = await this.httpClient.get<any>(`/api/v1/serviceaccounts?${query}`);
    if (response.isSuccess && response.body?.success) {
      return { success: true, data: response.body.data };
    }
    return { success: false, message: response.body?.message || 'Falha ao carregar contas de serviÃ§o' };
  }

  async createAccount(data: { ownerName: string; email: string; password: string }): Promise<{ success: boolean; data?: ServiceAccountDTO; message?: string }> {
    const response = await this.httpClient.post<any>('/api/v1/serviceaccounts', data);
    if (response.isSuccess && response.body?.success) {
      return { success: true, data: response.body.data };
    }
    return { success: false, message: response.body?.message || 'Falha ao criar conta de serviÃ§o' };
  }
}


