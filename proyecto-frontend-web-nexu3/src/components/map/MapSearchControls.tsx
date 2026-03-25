import React from 'react';
import { SearchInput } from '@components/common';

interface MapSearchControlsProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSearch: () => void;
  isLoading: boolean;
  onCreatePlan: () => void;
  canCreatePlan: boolean;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export default function MapSearchControls({
  searchQuery,
  onSearchQueryChange,
  onSearch,
  isLoading,
  onCreatePlan,
  canCreatePlan,
}: MapSearchControlsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-3">
        {/* Barra de búsqueda */}
        <div className="flex-1">
          <SearchInput
            label=""
            value={searchQuery}
            onChange={onSearchQueryChange}
            placeholder="Buscar lugar..."
          />
        </div>

        {/* Botón de búsqueda */}
        <button
          onClick={onSearch}
          disabled={isLoading || !searchQuery.trim()}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
        >
          {isLoading ? "🔍" : "Buscar"}
        </button>

        {/* Botón de crear plan */}
        <button
          onClick={onCreatePlan}
          disabled={!canCreatePlan}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
          title={canCreatePlan ? "Crear nuevo plan" : "No hay lugares para crear plan"}
        >
          📋 Crear Plan
        </button>
      </div>
    </div>
  );
} 