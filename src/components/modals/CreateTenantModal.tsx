import React, { useState } from 'react';
import { X, Copy, CheckCircle2 } from 'lucide-react';
import type { CreateTenantRequest } from '../../core/interfaces/CreateTenantRequest';

interface CreateTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTenantRequest) => Promise<void>;
}

export default function CreateTenantModal({ isOpen, onClose, onSubmit }: CreateTenantModalProps) {
  const [formData, setFormData] = useState<CreateTenantRequest>({
    name: '',
    subdomain: '',
    email: '',
    ownerName: '',
  });

  const [generatedPassword, setGeneratedPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
    let pass = "";
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(pass);
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!generatedPassword) {
      alert("Por favor, gere uma senha provisória primeiro.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ ...formData, ownerPassword: generatedPassword });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Provisionar Novo Inquilino</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Negócio</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: Burger King Downtown"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subdomínio KEPAS</label>
              <div className="flex items-center">
                <input
                  required
                  type="text"
                  value={formData.subdomain}
                  onChange={(e) => setFormData({ ...formData, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-blue-500 focus:border-blue-500 text-right font-mono"
                  placeholder="bk-downtown"
                />
                <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-gray-500 font-mono">
                  .kepas.com
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Proprietário</label>
                <input
                  required
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Carlos Silva"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail do Proprietário</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="carlos@exemplo.com"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Credencial Inicial (Senha)</label>
              {!generatedPassword ? (
                <button
                  type="button"
                  onClick={generatePassword}
                  className="w-full py-2 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                >
                  Gerar Senha Aleatória Segura
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={generatedPassword}
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg font-mono text-gray-700"
                  />
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 flex items-center justify-center"
                    title="Copiar"
                  >
                    {copied ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2">Envie esta senha para o inquilino junto com o link do painel.</p>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !generatedPassword}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Provisionando...' : 'Criar Inquilino'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

