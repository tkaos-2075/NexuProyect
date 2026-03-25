import { useEffect } from "react";
import { useUserSelection } from "@hooks/useUserSelection";
import UserSearchBar from "./UserSearchBar";
import UserList from "./UserList";

interface UserSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedUserIds: number[]) => void;
  initialSelectedIds?: number[];
}

export default function UserSelectionModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  initialSelectedIds = [] 
}: UserSelectionModalProps) {
  const {
    selectedUserIds,
    searchQuery,
    isLoading,
    error,
    filteredUsers,
    isAllSelected,
    loadUsers,
    toggleUser,
    toggleSelectAll,
    setSearchQuery,
  } = useUserSelection({ initialSelectedIds });

  // Cargar usuarios cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen, loadUsers]);

  const handleConfirm = () => {
    onConfirm(selectedUserIds);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Seleccionar Participantes ({selectedUserIds.length} seleccionados)
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Barra de búsqueda */}
          <UserSearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectAll={toggleSelectAll}
            isAllSelected={isAllSelected}
          />

          {/* Lista de usuarios */}
          <UserList
            users={filteredUsers}
            selectedUserIds={selectedUserIds}
            isLoading={isLoading}
            error={error}
            searchQuery={searchQuery}
            onToggleUser={toggleUser}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
          >
            Confirmar ({selectedUserIds.length})
          </button>
        </div>
      </div>
    </div>
  );
} 