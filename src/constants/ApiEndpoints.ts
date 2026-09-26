const API_PREFIX = '/api/v1';

export const ApiEndpoints = {
  SUPERADMIN_LOGIN: `${API_PREFIX}/auth/superadmin/login`,
  TENANT_LOGIN: `${API_PREFIX}/auth/login`,
  TENANTS: `${API_PREFIX}/tenants`,
  SYSTEM_SETTINGS: `${API_PREFIX}/system-settings`,
} as const;

