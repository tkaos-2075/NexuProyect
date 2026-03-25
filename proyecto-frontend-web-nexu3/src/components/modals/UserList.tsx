import { Loader, FeedbackMessage, EmptyState } from '@components/common';
import UserItem from './UserItem';

interface User {
  id: number;
  name: string;
  email: string;
  username?: string;
  role: string;
}

interface UserListProps {
  users: User[];
  selectedUserIds: number[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  onToggleUser: (userId: number) => void;
}

export default function UserList({ 
  users, 
  selectedUserIds, 
  isLoading, 
  error, 
  searchQuery, 
  onToggleUser 
}: UserListProps) {
  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-4">
        <Loader text="Cargando usuarios..." size="text-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 overflow-y-auto p-4">
        <FeedbackMessage type="error" message={error} />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-4">
        <EmptyState 
          message={
            searchQuery 
              ? "No se encontraron usuarios que coincidan con la búsqueda" 
              : "No hay usuarios disponibles"
          } 
        />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="space-y-2">
        {users.map((user) => (
          <UserItem
            key={user.id}
            user={user}
            isSelected={selectedUserIds.includes(user.id)}
            onToggle={onToggleUser}
          />
        ))}
      </div>
    </div>
  );
} 