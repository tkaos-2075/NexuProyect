import { useState, useCallback } from 'react';
import { getAllUsers } from '@services/users/getAllUsers';
import { UserRole } from '@interfaces/user/UsersResponseDto';

interface User {
  id: number;
  name: string;
  email: string;
  username?: string;
  role: UserRole;
}

interface UseUserSelectionProps {
  initialSelectedIds?: number[];
}

export const useUserSelection = ({ initialSelectedIds = [] }: UseUserSelectionProps = {}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>(initialSelectedIds);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar usuarios desde la API
  const loadUsers = useCallback(async () => {
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
      setError("Error al cargar la lista de usuarios");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Alternar selección de un usuario
  const toggleUser = useCallback((userId: number) => {
    setSelectedUserIds(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  }, []);

  // Seleccionar/deseleccionar todos los usuarios filtrados
  const toggleSelectAll = useCallback(() => {
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
  }, [users, searchQuery, selectedUserIds]);

  // Filtrar usuarios por rol y búsqueda
  const filteredUsers = users
    .filter(user => user.role === 'USER')
    .filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Verificar si todos los usuarios filtrados están seleccionados
  const isAllSelected = filteredUsers.length > 0 && 
    filteredUsers.every(user => selectedUserIds.includes(user.id));

  return {
    // Estado
    users,
    selectedUserIds,
    searchQuery,
    isLoading,
    error,
    filteredUsers,
    isAllSelected,
    
    // Acciones
    loadUsers,
    toggleUser,
    toggleSelectAll,
    setSearchQuery,
    setSelectedUserIds,
  };
}; 