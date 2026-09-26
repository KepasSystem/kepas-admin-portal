import axios, { type AxiosInstance, type AxiosResponse, type AxiosError } from 'axios';
import type { IHttpClient } from '../../core/interfaces/IHttpClient';
import type { IHttpResponse } from '../../core/interfaces/IHttpResponse';
import { LocalStorageKeys } from '../../core/enums/LocalStorageKeys';
import i18n from '../../core/i18n/i18n';
import Cookies from 'js-cookie';

export class AxiosHttpClient implements IHttpClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create();
    
    // Interceptor para anexar o token em todas as requisições
    this.instance.interceptors.request.use((config) => {
      const token = Cookies.get(LocalStorageKeys.ADMIN_TOKEN);
      const tokenType = Cookies.get(LocalStorageKeys.ADMIN_TOKEN_TYPE) || 'Bearer';
      
      if (token && config.headers) {
        config.headers.Authorization = `${tokenType} ${token}`;
      }

      // Injeta o idioma atual para que o Backend traduza as mensagens de erro
      if (config.headers) {
        config.headers['Accept-Language'] = i18n.language || 'pt-BR';
      }

      return config;
    });

    // Interceptor global de Responses (Sessão Expirada)
    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        // Só redireciona para login se for 401 E não for a própria rota de login
        if (error.response?.status === 401) {
          const url = error.config?.url || '';
          const isLoginRoute = url.includes('/auth/');
          
          if (!isLoginRoute) {
            Cookies.remove(LocalStorageKeys.ADMIN_TOKEN);
            Cookies.remove(LocalStorageKeys.ADMIN_TOKEN_TYPE);
            
            if (!window.location.pathname.includes('/login')) {
              window.location.href = '/login';
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async post<T = any>(url: string, body?: any, headers?: any): Promise<IHttpResponse<T>> {
    let response: AxiosResponse;
    try {
      response = await this.instance.post(url, body, { headers });
    } catch (error) {
      const axiosError = error as AxiosError;
      response = axiosError.response as AxiosResponse;
      if (!response) {
        throw error;
      }
    }

    return {
      statusCode: response.status,
      body: response.data,
      isSuccess: response.status >= 200 && response.status <= 299,
    };
  }

  async get<T = any>(url: string, headers?: any): Promise<IHttpResponse<T>> {
    let response: AxiosResponse;
    try {
      response = await this.instance.get(url, { headers });
    } catch (error) {
      const axiosError = error as AxiosError;
      response = axiosError.response as AxiosResponse;
      if (!response) {
        throw error;
      }
    }

    return {
      statusCode: response.status,
      body: response.data,
      isSuccess: response.status >= 200 && response.status <= 299,
    };
  }

  async put<T = any>(url: string, body?: any, headers?: any): Promise<IHttpResponse<T>> {
    let response: AxiosResponse;
    try {
      response = await this.instance.put(url, body, { headers });
    } catch (error) {
      const axiosError = error as AxiosError;
      response = axiosError.response as AxiosResponse;
      if (!response) { throw error; }
    }
    return { statusCode: response.status, body: response.data, isSuccess: response.status >= 200 && response.status <= 299 };
  }

  async patch<T = any>(url: string, body?: any, headers?: any): Promise<IHttpResponse<T>> {
    let response: AxiosResponse;
    try {
      response = await this.instance.patch(url, body, { headers });
    } catch (error) {
      const axiosError = error as AxiosError;
      response = axiosError.response as AxiosResponse;
      if (!response) { throw error; }
    }
    return { statusCode: response.status, body: response.data, isSuccess: response.status >= 200 && response.status <= 299 };
  }

  async delete<T = any>(url: string, headers?: any): Promise<IHttpResponse<T>> {
    let response: AxiosResponse;
    try {
      response = await this.instance.delete(url, { headers });
    } catch (error) {
      const axiosError = error as AxiosError;
      response = axiosError.response as AxiosResponse;
      if (!response) { throw error; }
    }
    return { statusCode: response.status, body: response.data, isSuccess: response.status >= 200 && response.status <= 299 };
  }
}
