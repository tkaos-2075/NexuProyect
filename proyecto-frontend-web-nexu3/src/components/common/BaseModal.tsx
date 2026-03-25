import React from "react";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footerActions?: React.ReactNode;
  maxWidth?: string;
}

export default function BaseModal({
  isOpen,
  onClose,
  title,
  children,
  footerActions,
  maxWidth = "max-w-2xl"
}: BaseModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full ${maxWidth} max-h-[90vh] flex flex-col`}>
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl"
          >
            ✕
          </button>
        </div>
        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
        {/* Footer */}
        {footerActions && (
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
            {footerActions}
          </div>
        )}
      </div>
    </div>
  );
} 