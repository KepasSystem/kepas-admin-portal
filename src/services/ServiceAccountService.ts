import { AxiosHttpClient } from '../infrastructure/http/AxiosHttpClient';
import type { ServiceAccountDTO } from '../core/interfaces/ServiceAccountDTO';

export class ServiceAccountService {
  constructor(private httpClient: AxiosHttpClient) {}

  async getAllAccounts(): Promise<{ success: boolean; data?: ServiceAccountDTO[]; message?: string }> {
    const response = await this.httpClient.get<any>('/api/v1/serviceaccounts');
    if (response.isSuccess && response.body?.success) {
      return { success: true, data: response.body.data };
    }
    return { success: false, message: response.body?.message || 'Falha ao carregar contas de serviço' };
  }

  async createAccount(data: any): Promise<{ success: boolean; data?: ServiceAccountDTO; message?: string }> {
    const response = await this.httpClient.post<any>('/api/v1/serviceaccounts', data);
    if (response.isSuccess && response.body?.success) {
      return { success: true, data: response.body.data };
    }
    return { success: false, message: response.body?.message || 'Falha ao criar conta de serviço' };
  }
}
