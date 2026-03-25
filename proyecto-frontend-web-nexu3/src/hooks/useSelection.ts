import { useState, useCallback, useMemo } from 'react';

interface UseSelectionProps<T> {
  initialSelected?: T[];
  maxSelections?: number;
}

export const useSelection = <T>({ 
  initialSelected = [], 
  maxSelections 
}: UseSelectionProps<T> = {}) => {
  const [selectedItems, setSelectedItems] = useState<T[]>(initialSelected);
  const [searchQuery, setSearchQuery] = useState('');

  // Alternar selección de un elemento
  const toggleItem = useCallback((item: T) => {
    setSelectedItems(prev => {
      const isSelected = prev.includes(item);
      if (isSelected) {
        return prev.filter(i => i !== item);
      } else {
        if (maxSelections && prev.length >= maxSelections) {
          return prev; // No agregar si se alcanzó el límite
        }
        return [...prev, item];
      }
    });
  }, [maxSelections]);

  // Seleccionar múltiples elementos
  const selectItems = useCallback((items: T[]) => {
    setSelectedItems(items);
  }, []);

  // Deseleccionar todos
  const clearSelection = useCallback(() => {
    setSelectedItems([]);
  }, []);

  // Seleccionar todos los elementos filtrados
  const selectAll = useCallback((allItems: T[]) => {
    const filteredItems = allItems.filter(item => 
      String(item).toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (filteredItems.every(item => selectedItems.includes(item))) {
      // Deseleccionar todos los filtrados
      setSelectedItems(prev => prev.filter(item => !filteredItems.includes(item)));
    } else {
      // Seleccionar todos los filtrados
      setSelectedItems(prev => {
        const newSelection = [...prev];
        filteredItems.forEach(item => {
          if (!newSelection.includes(item)) {
            if (!maxSelections || newSelection.length < maxSelections) {
              newSelection.push(item);
            }
          }
        });
        return newSelection;
      });
    }
  }, [selectedItems, searchQuery, maxSelections]);

  // Verificar si todos los elementos filtrados están seleccionados
  const isAllSelected = useMemo(() => {
    return selectedItems.length > 0;
  }, [selectedItems]);

  // Contar elementos seleccionados
  const selectedCount = selectedItems.length;

  return {
    // Estado
    selectedItems,
    searchQuery,
    selectedCount,
    isAllSelected,
    
    // Acciones
    toggleItem,
    selectItems,
    clearSelection,
    selectAll,
    setSearchQuery,
    
    // Utilidades
    setSelectedItems
  };
}; 