import { AxiosHttpClient } from '../../infrastructure/http/AxiosHttpClient';
import { AuthService } from '../../services/AuthService';
import { PlatformAdminService } from '../../services/PlatformAdminService';
import { PlatformRoleService } from '../../services/PlatformRoleService';
import { ServiceAccountService } from '../../services/ServiceAccountService';
import { SystemSettingsService } from '../../services/SystemSettingsService';
import { TenantService } from '../../services/TenantService';

class DIContainer {
  private static _httpClient = new AxiosHttpClient();
  
  // Singleton instances
  private static _authService = new AuthService(this._httpClient);
  private static _platformAdminService = new PlatformAdminService(this._httpClient);
  private static _platformRoleService = new PlatformRoleService(this._httpClient);
  private static _serviceAccountService = new ServiceAccountService(this._httpClient);
  private static _systemSettingsService = new SystemSettingsService(this._httpClient);
  private static _tenantService = new TenantService(this._httpClient);

  /** Resolvers */
  public static getHttpClient() {
    return this._httpClient;
  }

  public static getAuthService() {
    return this._authService;
  }

  public static getPlatformAdminService() {
    return this._platformAdminService;
  }

  public static getPlatformRoleService() {
    return this._platformRoleService;
  }

  public static getServiceAccountService() {
    return this._serviceAccountService;
  }

  public static getSystemSettingsService() {
    return this._systemSettingsService;
  }

  public static getTenantService() {
    return this._tenantService;
  }
}

export const DI = DIContainer;
