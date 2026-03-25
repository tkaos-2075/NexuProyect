import React from 'react';

interface ModalContainerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
  showCloseButton?: boolean;
  className?: string;
}

export default function ModalContainer({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg",
  showCloseButton = true,
  className = ""
}: ModalContainerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 ${maxWidth} w-full mx-auto relative ${className}`}>
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 dark:hover:text-white text-2xl font-bold focus:outline-none"
            title="Cerrar"
          >
            ✕
          </button>
        )}
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center mb-6">
          {title}
        </h2>
        <hr className="border-gray-200 dark:border-gray-700 mb-8" />
        {children}
      </div>
    </div>
  );
} 