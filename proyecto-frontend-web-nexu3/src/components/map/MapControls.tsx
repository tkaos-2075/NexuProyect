import React from "react";
import { Loader } from '@components/common';

interface MapControlsProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onSearch: () => void;
  isLoading: boolean;
  onCreatePlan: () => void;
  canCreatePlan: boolean;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

const MapControls: React.FC<MapControlsProps> = ({
  searchQuery,
  onSearchQueryChange,
  onSearch,
  isLoading,
  onCreatePlan,
  canCreatePlan,
  onKeyPress,
}) => (
  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 p-4">
    <div className="flex items-center space-x-3">
      <div className="flex-1 max-w-none">
        <input
          type="text"
          placeholder="Buscar lugar..."
          value={searchQuery}
          onChange={e => onSearchQueryChange(e.target.value)}
          onKeyPress={onKeyPress}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          disabled={isLoading}
        />
      </div>
      <button
        onClick={onSearch}
        disabled={isLoading || !searchQuery.trim()}
        className="px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200 flex items-center space-x-1 whitespace-nowrap text-sm"
      >
        {isLoading ? (
          <>
            <Loader text="" size="text-base" colorClass="text-white" className="mr-2" />
            <span>Buscando...</span>
          </>
        ) : (
          <>
            <span>🔍</span>
            <span>Buscar</span>
          </>
        )}
      </button>
      <button
        onClick={onCreatePlan}
        disabled={!canCreatePlan}
        className="px-3 py-2 bg-cyan-500 dark:bg-cyan-700 hover:bg-cyan-600 dark:hover:bg-cyan-800 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200 flex items-center space-x-1 whitespace-nowrap text-sm"
        title={!canCreatePlan ? "Primero carga los lugares de Nexu" : "Crear un nuevo plan"}
      >
        <span>📋</span>
        <span>Crear Plan</span>
      </button>
    </div>
  </div>
);

export default MapControls; 