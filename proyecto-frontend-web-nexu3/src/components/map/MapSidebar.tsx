import React from "react";

interface MapSidebarProps {
  children?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  title?: string;
}

const MapSidebar: React.FC<MapSidebarProps> = ({ children, isOpen = true, onClose, title }) => {
  if (!isOpen) return null;
  return (
    <aside className="fixed top-20 right-6 z-40 w-96 max-w-full h-[calc(100vh-6rem-5px)] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title || 'Panel de información'}</h2>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl">✕</button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {children || <div className="text-gray-500 dark:text-gray-300 text-center">Sin contenido</div>}
      </div>
    </aside>
  );
};

export default MapSidebar; 