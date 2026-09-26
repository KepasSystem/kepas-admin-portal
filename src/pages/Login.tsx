import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthService } from '../services/AuthService';
import { AxiosHttpClient } from '../infrastructure/http/AxiosHttpClient';
import { LocalStorageKeys } from '../core/enums/LocalStorageKeys';
import Cookies from 'js-cookie';

export default function Login() {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Injetando dependências manualmente (poderia usar context ou hooks customizados)
  const authService = useMemo(() => new AuthService(new AxiosHttpClient()), []);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem(LocalStorageKeys.LANGUAGE, lang);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.superAdminLogin(email, password);

      if (!response.success) {
        throw new Error(response.message);
      }

      Cookies.set(LocalStorageKeys.ADMIN_TOKEN, response.token!, { secure: true, sameSite: 'strict' });
      Cookies.set(LocalStorageKeys.ADMIN_TOKEN_TYPE, response.tokenType || 'Bearer', { secure: true, sameSite: 'strict' });
      navigate('/dashboard');
    } catch (err: any) {
      if (!err.response && err.message === 'Network Error') {
        setError('Não foi possível conectar ao servidor. Aguarde um momento e tente novamente.');
      } else {
        setError(err.message || 'Erro ao autenticar. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col p-4">
      
      {/* Topbar com seletor de idioma */}
      <div className="w-full flex justify-end">
        <select 
          value={i18n.language} 
          onChange={handleLanguageChange}
          className="px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="pt-BR">Português (BR)</option>
          <option value="en-US">English (US)</option>
        </select>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">KEPAS</h1>
          <p className="text-gray-500 mt-2 font-medium">Global Management Console</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email do Administrador</label>
            <input 
              type="email" 
              required
              className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              placeholder="admin@nskepas.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input 
              type="password" 
              required
              className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 rounded-lg shadow-md text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all"
          >
            {loading ? 'Autenticando...' : 'Acessar Sistema'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="#" className="text-sm text-blue-600 hover:text-blue-500 font-medium">
            Recuperação via 2FA ou WhatsApp
          </a>
        </div>
        </div>
      </div>
    </div>
  );
}

