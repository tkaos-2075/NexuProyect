import { useState, useEffect, useCallback } from "react";

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
}

function getToastStyles(type: ToastType) {
  const base = "fixed bottom-4 right-4 z-50 max-w-sm w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border-l-4 p-4 transform transition-all duration-300";
  const color = {
    success: "border-green-500",
    error: "border-red-500",
    warning: "border-yellow-500",
    info: "border-blue-500"
  }[type] || "border-gray-500";
  return `${base} ${color}`;
}

function getIcon(type: ToastType) {
  return {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  }[type] || '💬';
}

function getTitle(type: ToastType) {
  return {
    success: 'Éxito',
    error: 'Error',
    warning: 'Advertencia',
    info: 'Información'
  }[type] || 'Notificación';
}

export default function Toast({ message, type, duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`${getToastStyles(type)} ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
      <div className="flex items-start space-x-3">
        <span className="text-lg">{getIcon(type)}</span>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
            {getTitle(type)}
          </h4>
          <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
            {message}
          </p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

// Hook optimizado para manejar múltiples toasts
export function useToast() {
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: ToastType; duration?: number }>>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration?: number) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev.slice(-2), { id, message, type, duration }]); // Solo mantener los últimos 3 toasts
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const ToastContainer = useCallback(() => (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  ), [toasts, removeToast]);

  return { showToast, ToastContainer };
} 