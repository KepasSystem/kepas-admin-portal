import type { IHttpClient } from '../core/interfaces/IHttpClient';
import { ApiEndpoints } from '../constants/ApiEndpoints';
import type { AuthResult } from '../core/interfaces/AuthResult';

export class AuthService {
  constructor(private readonly httpClient: IHttpClient) {}

  async superAdminLogin(email: string, password: string): Promise<AuthResult> {
    const response = await this.httpClient.post(`${ApiEndpoints.SUPERADMIN_LOGIN}`, {
      email,
      password,
    });

    if (response.isSuccess && response.body?.success) {
      return { 
        success: true, 
        token: response.body.data?.token,
        tokenType: response.body.data?.tokenType
      };
    }

    return { success: false, message: response.body?.message || 'Falha na autenticação' };
  }
}
