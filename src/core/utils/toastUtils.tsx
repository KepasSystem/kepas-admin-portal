import toast, { Toast } from 'react-hot-toast';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import React from 'react';

interface ToastOptions {
  duration?: number | null;
}

const CustomToast = ({ t, title, message, type, duration }: { t: Toast, title?: string, message: string, type: 'success' | 'error' | 'info', duration?: number | null }) => {
  return (
    <div
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            {type === 'success' && <CheckCircle className="h-10 w-10 text-green-500" />}
            {type === 'error' && <AlertCircle className="h-10 w-10 text-red-500" />}
            {type === 'info' && <Info className="h-10 w-10 text-blue-500" />}
          </div>
          <div className="ml-3 flex-1">
            {title && <p className="text-sm font-medium text-gray-900">{title}</p>}
            <p className="mt-1 text-sm text-gray-500">{message}</p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export const showToast = {
  success: (message: string, title?: string, options?: ToastOptions) => {
    toast.custom((t) => <CustomToast t={t} title={title} message={message} type="success" duration={options?.duration} />, {
      duration: options?.duration === null ? Infinity : (options?.duration || 4000),
    });
  },
  error: (message: string, title?: string, options?: ToastOptions) => {
    toast.custom((t) => <CustomToast t={t} title={title} message={message} type="error" duration={options?.duration} />, {
      duration: options?.duration === null ? Infinity : (options?.duration || 4000),
    });
  },
  info: (message: string, title?: string, options?: ToastOptions) => {
    toast.custom((t) => <CustomToast t={t} title={title} message={message} type="info" duration={options?.duration} />, {
      duration: options?.duration === null ? Infinity : (options?.duration || 4000),
    });
  }
};
