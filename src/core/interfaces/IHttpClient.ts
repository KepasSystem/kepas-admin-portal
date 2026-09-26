import type { IHttpResponse } from './IHttpResponse';

export interface IHttpClient {
  get<T = any>(url: string, headers?: any): Promise<IHttpResponse<T>>;
  post<T = any>(url: string, body?: any, headers?: any): Promise<IHttpResponse<T>>;
  put<T = any>(url: string, body?: any, headers?: any): Promise<IHttpResponse<T>>;
  patch<T = any>(url: string, body?: any, headers?: any): Promise<IHttpResponse<T>>;
  delete<T = any>(url: string, headers?: any): Promise<IHttpResponse<T>>;
}

