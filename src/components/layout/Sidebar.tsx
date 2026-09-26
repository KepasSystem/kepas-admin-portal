import React from 'react';
import { NavLink } from 'react-router-dom';
import { ADMIN_SIDEBAR_ITEMS } from '../../constants/SidebarItems';

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white h-screen flex flex-col transition-all duration-300">
      <div className="h-16 flex items-center justify-center border-b border-gray-800 bg-gray-950">
        <span className="text-xl font-black tracking-tight">KEPAS</span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-1 px-3">
          {ADMIN_SIDEBAR_ITEMS.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t border-gray-800">
        <div className="text-xs text-gray-500 text-center">
          Super Admin Portal v1.0
        </div>
      </div>
    </div>
  );
}

