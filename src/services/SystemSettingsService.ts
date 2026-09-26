import { LocalStorageKeys } from '../core/enums/LocalStorageKeys';
import type { IHttpClient } from '../core/interfaces/IHttpClient';
import { ApiEndpoints } from '../constants/ApiEndpoints';

export class SystemSettingsService {
  constructor(private readonly httpClient: IHttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem(LocalStorageKeys.ADMIN_TOKEN);
    const tokenType = localStorage.getItem(LocalStorageKeys.ADMIN_TOKEN_TYPE) || 'Bearer';
    return {
      Authorization: `${tokenType} ${token}`,
    };
  }

  async getSettings(): Promise<{ success: boolean; data?: any; message?: string }> {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    const response = await this.httpClient.get<any>(
      `${apiUrl}${ApiEndpoints.SYSTEM_SETTINGS}`, 
      this.getAuthHeaders()
    );

    if (response.isSuccess && response.body?.success) {
      return { success: true, data: response.body.data };
    }
    return { success: false, message: response.body?.message || 'Falha ao carregar configs' };
  }

  async updateSmtp(smtpEmail: string, smtpPassword: string): Promise<{ success: boolean; message?: string }> {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    const response = await this.httpClient.put<any>(
      `${apiUrl}${ApiEndpoints.SYSTEM_SETTINGS}/smtp`,
      { smtpEmail, smtpPassword },
      this.getAuthHeaders()
    );

    if (response.isSuccess && response.body?.success) {
      return { success: true };
    }
    return { success: false, message: response.body?.message || 'Falha ao salvar SMTP' };
  }

  async generateQrCode(): Promise<{ success: boolean; data?: string; message?: string }> {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    const response = await this.httpClient.get<any>(
      `${apiUrl}${ApiEndpoints.SYSTEM_SETTINGS}/whatsapp/qrcode`,
      this.getAuthHeaders()
    );

    if (response.isSuccess && response.body?.success) {
      return { success: true, data: response.body.data };
    }
    return { success: false, message: response.body?.message || 'Falha ao gerar QR Code' };
  }
}



