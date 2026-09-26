import { AxiosHttpClient } from '../../infrastructure/http/AxiosHttpClient';
import { AuthService } from '../../services/AuthService';
import { PlatformAdminService } from '../../services/PlatformAdminService';
import { PlatformRoleService } from '../../services/PlatformRoleService';
import { ServiceAccountService } from '../../services/ServiceAccountService';
import { SystemSettingsService } from '../../services/SystemSettingsService';
import { TenantService } from '../../services/TenantService';

type Factory<T> = (provider: IServiceProvider) => T;

export interface IServiceProvider {
  resolve<T>(token: string | any): T;
}

class ServiceCollection implements IServiceProvider {
  private _singletons = new Map<any, any>();
  private _factories = new Map<any, Factory<any>>();

  // Equivalente ao AddSingleton do C#
  public addSingleton<T>(token: any, factory: Factory<T>): void {
    this._factories.set(token, (provider) => {
      if (!this._singletons.has(token)) {
        this._singletons.set(token, factory(provider));
      }
      return this._singletons.get(token);
    });
  }

  // Equivalente ao AddTransient do C# (cria nova instância sempre que pedido)
  public addTransient<T>(token: any, factory: Factory<T>): void {
    this._factories.set(token, factory);
  }

  // Resolve as dependências
  public resolve<T>(token: any): T {
    const factory = this._factories.get(token);
    if (!factory) {
      throw new Error(`Service '${token}' not registered in DI container.`);
    }
    return factory(this) as T;
  }
}

// Inicializamos a nossa Collection
const services = new ServiceCollection();

// 1. Registamos a base (Infraestrutura)
services.addSingleton('IHttpClient', () => new AxiosHttpClient());

// 2. Registamos os Serviços injetando dinamicamente o IHttpClient
services.addSingleton('IAuthService', (p) => new AuthService(p.resolve('IHttpClient')));
services.addSingleton('IPlatformAdminService', (p) => new PlatformAdminService(p.resolve('IHttpClient')));
services.addSingleton('IPlatformRoleService', (p) => new PlatformRoleService(p.resolve('IHttpClient')));
services.addSingleton('IServiceAccountService', (p) => new ServiceAccountService(p.resolve('IHttpClient')));
services.addSingleton('ISystemSettingsService', (p) => new SystemSettingsService(p.resolve('IHttpClient')));
services.addSingleton('ITenantService', (p) => new TenantService(p.resolve('IHttpClient')));

// Exportamos o provider final (Opcionalmente podes exportar o container para usar DI.resolve('IAuthService'))
export const DI = services;
