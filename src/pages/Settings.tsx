import React, { useState, useEffect, useMemo } from 'react';
import { Save, Mail, MessageCircle, QrCode, AlertCircle, CheckCircle2 } from 'lucide-react';
import { SystemSettingsService } from '../services/SystemSettingsService';
import { AxiosHttpClient } from '../infrastructure/http/AxiosHttpClient';

export default function Settings() {
  const [smtpEmail, setSmtpEmail] = useState('');
  const [smtpPassword, setSmtpPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [wppStatus, setWppStatus] = useState('disconnected'); // disconnected, loading, connected

  const settingsService = useMemo(() => new SystemSettingsService(new AxiosHttpClient()), []);

  useEffect(() => {
    loadSettings();
  }, [settingsService]);

  const loadSettings = async () => {
    const res = await settingsService.getSettings();
    if (res.success && res.data) {
      setSmtpEmail(res.data.smtpEmail || '');
      setWppStatus(res.data.isWhatsAppConnected ? 'connected' : 'disconnected');
    }
  };

  const handleSaveSmtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await settingsService.updateSmtp(smtpEmail, smtpPassword);
    
    if (res.success) {
      setMessage({ type: 'success', text: 'Configurações SMTP salvas com sucesso no banco global!' });
    } else {
      setMessage({ type: 'error', text: res.message || 'Erro ao salvar.' });
    }
    
    setLoading(false);
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const generateQrCode = async () => {
    setWppStatus('loading');
    
    const res = await settingsService.generateQrCode();
    if (res.success && res.data) {
      setQrCode(res.data);
      setWppStatus('disconnected'); // Ainda desconectado, só gerou a imagem
    } else {
      setWppStatus('disconnected');
      alert(res.message || 'Erro ao gerar QR Code');
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Configurações Globais do Sistema</h1>
        <p className="text-sm text-gray-500 mt-1">Gerencie credenciais base da plataforma KEPAS.</p>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-lg flex items-center ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <AlertCircle className="w-5 h-5 mr-2" />}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card SMTP */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center">
            <Mail className="w-5 h-5 text-blue-600 mr-2" />
            <h2 className="font-semibold text-gray-800">Servidor de E-mail (SMTP)</h2>
          </div>
          <form onSubmit={handleSaveSmtp} className="p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail Remetente Oficial</label>
              <input
                required
                type="email"
                value={smtpEmail}
                onChange={(e) => setSmtpEmail(e.target.value)}
                placeholder="no-reply@kepas.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha de Aplicativo (SMTP)</label>
              <input
                required
                type="password"
                value={smtpPassword}
                onChange={(e) => setSmtpPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Salvando...' : 'Salvar SMTP'}
              </button>
            </div>
          </form>
        </div>

        {/* Card WhatsApp Engine */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center">
              <MessageCircle className="w-5 h-5 text-green-600 mr-2" />
              <h2 className="font-semibold text-gray-800">WhatsApp Engine</h2>
            </div>
            {wppStatus === 'connected' ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Conectado</span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">Desconectado</span>
            )}
          </div>
          <div className="p-5 flex flex-col items-center justify-center h-64 text-center">
            {wppStatus === 'connected' ? (
              <div className="flex flex-col items-center text-green-600">
                <CheckCircle2 className="w-16 h-16 mb-4" />
                <p className="font-medium text-gray-800">WhatsApp Oficial Operante</p>
                <p className="text-sm text-gray-500 mt-1">Sessão ativa e escutando webhooks.</p>
              </div>
            ) : (
              <>
                {qrCode ? (
                  <div className="flex flex-col items-center">
                    <img src={qrCode} alt="QR Code WhatsApp" className="w-40 h-40 border-4 border-white shadow-lg rounded-lg mb-4" />
                    <p className="text-sm text-gray-600 mb-2">Escaneie este QR Code no aparelho oficial da plataforma.</p>
                    <button onClick={generateQrCode} className="text-sm text-blue-600 hover:underline">
                      Gerar novo código
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <QrCode className="w-16 h-16 text-gray-300 mb-4" />
                    <p className="text-sm text-gray-600 mb-4">Nenhuma sessão ativa. É necessário conectar um número para disparar mensagens globais (ex: Cobranças, OTP).</p>
                    <button 
                      onClick={generateQrCode}
                      disabled={wppStatus === 'loading'}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      {wppStatus === 'loading' ? 'Solicitando QR Code...' : 'Gerar QR Code de Conexão'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

