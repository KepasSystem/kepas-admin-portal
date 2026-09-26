import React from 'react';
import { Bell, ShieldCheck } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10">
      <div className="text-xl font-semibold text-gray-800">
        Gestão KEPAS
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="text-gray-400 hover:text-blue-600 transition-colors">
          <Bell className="h-6 w-6" />
        </button>
        
        <div className="flex items-center space-x-2 border-l pl-4 border-gray-200 cursor-pointer">
          <ShieldCheck className="h-8 w-8 text-blue-600" />
          <div className="hidden md:block">
            <p className="text-sm font-bold text-gray-800">Super Admin</p>
            <p className="text-xs text-gray-500">Acesso Total</p>
          </div>
        </div>
      </div>
    </header>
  );
}

