import type { IHttpClient } from '../core/interfaces/IHttpClient';
import { ApiEndpoints } from '../constants/ApiEndpoints';

export class SystemSettingsService {
  constructor(private readonly httpClient: IHttpClient) {}

  async getSettings(): Promise<{ success: boolean; data?: any; message?: string }> {
    
    const response = await this.httpClient.get<any>(
      `${ApiEndpoints.SYSTEM_SETTINGS}`
    );

    if (response.isSuccess && response.body?.success) {
      return { success: true, data: response.body.data };
    }
    return { success: false, message: response.body?.message || 'Falha ao carregar configs' };
  }

  async updateSmtp(smtpEmail: string, smtpPassword: string): Promise<{ success: boolean; message?: string }> {
    
    const response = await this.httpClient.put<any>(
      `${ApiEndpoints.SYSTEM_SETTINGS}/smtp`,
      { smtpEmail, smtpPassword }
    );

    if (response.isSuccess && response.body?.success) {
      return { success: true };
    }
    return { success: false, message: response.body?.message || 'Falha ao salvar SMTP' };
  }

  async generateQrCode(): Promise<{ success: boolean; data?: string; message?: string }> {
    
    const response = await this.httpClient.get<any>(
      `${ApiEndpoints.SYSTEM_SETTINGS}/whatsapp/qrcode`
    );

    if (response.isSuccess && response.body?.success) {
      return { success: true, data: response.body.data };
    }
    return { success: false, message: response.body?.message || 'Falha ao gerar QR Code' };
  }
}




