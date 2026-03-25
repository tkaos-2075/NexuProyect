import { useState, useEffect } from "react";
import { getAllUsers } from "@services/users/getAllUsers";
import { UserRole } from '@interfaces/user/UsersResponseDto';

interface User {
  id: number;
  name: string;
  email: string;
  username?: string;
  role: UserRole;
}

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
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>(initialSelectedIds);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  const loadUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAllUsers();
      setUsers((response.data || []).map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        username: u.username,
        role: u.role,
      })));
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      setError("Error al cargar la lista de usuarios. Por favor, intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserToggle = (userId: number) => {
    setSelectedUserIds(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleSelectAll = () => {
    const filteredUsers = users.filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const filteredUserIds = filteredUsers.map(user => user.id);
    
    if (filteredUserIds.every(id => selectedUserIds.includes(id))) {
      // Deseleccionar todos los filtrados
      setSelectedUserIds(prev => prev.filter(id => !filteredUserIds.includes(id)));
    } else {
      // Seleccionar todos los filtrados
      setSelectedUserIds(prev => {
        const newSelection = [...prev];
        filteredUserIds.forEach(id => {
          if (!newSelection.includes(id)) {
            newSelection.push(id);
          }
        });
        return newSelection;
      });
    }
  };

  const handleConfirm = () => {
    onConfirm(selectedUserIds);
    onClose();
  };

  // Filtrar usuarios por rol antes de cualquier otro filtro
  const onlyUserRole = users.filter(user => user.role === 'USER');

  // Filtrar usuarios por búsqueda
  const filteredUsers = onlyUserRole.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isAllSelected = filteredUsers.length > 0 && 
    filteredUsers.every(user => selectedUserIds.includes(user.id));

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
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Buscar usuarios por nombre o email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <button
                onClick={handleSelectAll}
                className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 text-sm"
              >
                {isAllSelected ? "Deseleccionar Todo" : "Seleccionar Todo"}
              </button>
            </div>
          </div>

          {/* Lista de usuarios */}
          <div className="flex-1 overflow-y-auto p-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin text-2xl">⏳</div>
                <span className="ml-2 text-gray-500 dark:text-gray-400">Cargando usuarios...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500 dark:text-red-400">
                <p>{error}</p>
                <p className="text-sm mt-2">Usando datos de ejemplo</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {searchQuery ? "No se encontraron usuarios que coincidan con la búsqueda" : "No hay usuarios disponibles"}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors duration-200 ${
                      selectedUserIds.includes(user.id)
                        ? "bg-blue-50 border-blue-300 dark:bg-blue-900/20 dark:border-blue-600"
                        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => handleUserToggle(user.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user.email}
                          </p>
                          {user.username && (
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              @{user.username}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded border-2 ${
                        selectedUserIds.includes(user.id)
                          ? "bg-blue-500 border-blue-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}>
                        {selectedUserIds.includes(user.id) && (
                          <span className="text-white text-xs">✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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