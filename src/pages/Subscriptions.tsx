import React, { useState } from 'react';
import { Package, Blocks, Plus, Edit, DollarSign } from 'lucide-react';
import { AxiosHttpClient } from '../infrastructure/http/AxiosHttpClient';
import { useQuery } from '@tanstack/react-query';
import { showToast } from '../core/utils/toastUtils';

export default function Subscriptions() {
  const [activeTab, setActiveTab] = useState<'modules' | 'plans'>('modules');

  const { data: modules = [], isLoading: isLoadingModules } = useQuery({
    queryKey: ['subscriptions', 'modules'],
    queryFn: async () => {
      const http = new AxiosHttpClient();
      const res = await http.get<any>(`/api/v1/subscriptions/modules`);
      if (!res.isSuccess) throw new Error(res.body?.message || 'Error fetching modules');
      return res.body?.data || [];
    }
  });

  const { data: plans = [], isLoading: isLoadingPlans } = useQuery({
    queryKey: ['subscriptions', 'plans'],
    queryFn: async () => {
      const http = new AxiosHttpClient();
      const res = await http.get<any>(`/api/v1/subscriptions/plans`);
      if (!res.isSuccess) throw new Error(res.body?.message || 'Error fetching plans');
      return res.body?.data || [];
    }
  });

  // Fetch KPIs just for the global MRR (or mock it for now since we don't have a specific MRR endpoint)
  const { data: kpis } = useQuery({
    queryKey: ['kpis'],
    queryFn: async () => {
      const http = new AxiosHttpClient();
      const res = await http.get<any>(`/api/v1/system-analytics/kpis`);
      return res.body?.data || { mrr: 0, activeSubscriptions: 0 };
    }
  });

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto w-full">
      <div className="mb-6 flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Precificação e Empacotamento</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie módulos avulsos e combos promocionais.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-200 flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            <div className="flex flex-col">
              <span className="text-xs uppercase font-bold tracking-wider">MRR Global</span>
              <span className="font-black text-lg">R$ {kpis?.mrr?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}</span>
            </div>
          </div>
          <button 
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm h-full py-3"
            onClick={() => showToast.info('Em Breve!')}
          >
            <Plus className="w-5 h-5 mr-2" />
            {activeTab === 'modules' ? 'Novo Módulo' : 'Novo Combo'}
          </button>
        </div>
      </div>

      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('modules')}
            className={`${activeTab === 'modules' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <Blocks className="w-4 h-4 mr-2" /> Módulos Avulsos
          </button>
          <button
            onClick={() => setActiveTab('plans')}
            className={`${activeTab === 'plans' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <Package className="w-4 h-4 mr-2" /> Combos (Planos Fechados)
          </button>
        </nav>
      </div>

      {activeTab === 'modules' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoadingModules && <div className="col-span-full text-center text-gray-500 py-10">Carregando módulos...</div>}
          {!isLoadingModules && modules.map((m: any) => (
            <div key={m.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 rounded-lg text-blue-600"><Blocks className="w-6 h-6" /></div>
                <button className="text-gray-400 hover:text-blue-600"><Edit className="w-5 h-5" /></button>
              </div>
              <h3 className="text-lg font-bold text-gray-900">{m.name}</h3>
              <p className="text-sm text-gray-500 mt-1">Preço Base Avulso:</p>
              <div className="mt-4 text-3xl font-black text-gray-900">R$ {m.basePrice.toFixed(2)}<span className="text-sm text-gray-500 font-normal">/mês</span></div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoadingPlans && <div className="col-span-full text-center text-gray-500 py-10">Carregando planos...</div>}
          {!isLoadingPlans && plans.map((p: any) => (
            <div key={p.id} className="bg-white rounded-xl shadow-sm border-2 border-transparent hover:border-blue-500 transition-colors p-6 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">COMBO OFERTA</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 mt-4">{p.name}</h3>
              <div className="text-4xl font-black text-gray-900 mb-6">R$ {p.price.toFixed(2)}<span className="text-sm text-gray-500 font-normal">/mês</span></div>
              <ul className="space-y-3 flex-1 mb-6">
                {p.modules.map((mod: string, idx: number) => (
                  <li key={idx} className="flex items-center text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                    Inclui: {mod}
                  </li>
                ))}
              </ul>
              <button className="w-full py-2 border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors">Editar Pacote</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}




