import { DI } from '../core/di/DependencyInjection';
import React, { useState, useEffect } from 'react';
import { DollarSign, Users, Briefcase, TrendingUp } from 'lucide-react';
import { AxiosHttpClient } from '../infrastructure/http/AxiosHttpClient';
import { showToast } from '../core/utils/toastUtils';

export default function Dashboard() {
  const [kpis, setKpis] = useState({
    totalServiceAccounts: 0,
    totalTenants: 0,
    activeTenants: 0,
    inactiveTenants: 0,
    mrr: 0,
    newSubscriptionsToday: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKpis();
  }, []);

  const fetchKpis = async () => {
    const http = DI.getHttpClient();
    try {
      const res = await http.get<any>(`/api/v1/system-analytics/kpis`);
      if (res.isSuccess && res.body?.data) {
        setKpis(res.body.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto w-full space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Visão Geral da KEPAS</h1>
          <p className="text-sm text-gray-500 mt-1">Monitore a saúde financeira e o volume de clientes da plataforma.</p>
        </div>
        <button 
          onClick={() => showToast.info('Em Breve!')}
          className="text-sm text-blue-600 font-medium hover:underline"
        >
          Baixar Relatório (PDF)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* MRR */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-medium text-gray-500">Receita Mensal (MRR)</p>
            <div className="p-2 bg-green-50 rounded-lg text-green-600"><DollarSign className="w-5 h-5" /></div>
          </div>
          <div className="flex items-end space-x-2">
            <h3 className="text-3xl font-black text-gray-900">
              {loading ? '...' : `R$ ${kpis.mrr.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            </h3>
          </div>
        </div>

        {/* Contas de Serviço */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-medium text-gray-500">Contas de Serviço</p>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Briefcase className="w-5 h-5" /></div>
          </div>
          <div className="flex items-end space-x-2">
            <h3 className="text-3xl font-black text-gray-900">{loading ? '...' : kpis.totalServiceAccounts}</h3>
          </div>
        </div>

        {/* Tenants Ativos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-medium text-gray-500">Inquilinos (Tenants)</p>
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><Users className="w-5 h-5" /></div>
          </div>
          <div className="flex items-end space-x-2">
            <h3 className="text-3xl font-black text-gray-900">{loading ? '...' : kpis.activeTenants}</h3>
            <span className="text-sm font-medium text-gray-500 mb-1">/ {kpis.totalTenants} ativos</span>
          </div>
        </div>

        {/* Inativos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-medium text-gray-500">Novas Assinaturas Hoje</p>
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><TrendingUp className="w-5 h-5" /></div>
          </div>
          <div className="flex items-end space-x-2">
            <h3 className="text-3xl font-black text-gray-900">{loading ? '...' : `+${kpis.newSubscriptionsToday}`}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-1 min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 font-medium mb-2">Gráfico de Crescimento</p>
          <p className="text-sm text-gray-400">Implementação de Chart.js/Recharts planejada para a próxima versão.</p>
        </div>
      </div>
    </div>
  );
}
