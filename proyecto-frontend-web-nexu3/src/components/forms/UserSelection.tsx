import { useState } from 'react';
import { UserSelectionModal } from '@components/modals';

interface User {
  id: number;
  name: string;
  email: string;
  username?: string;
}

interface UserSelectionProps {
  selectedUsers: User[];
  onUserSelection: (userIds: number[]) => void;
}

export default function UserSelection({ selectedUsers, onUserSelection }: UserSelectionProps) {
  const [showUserModal, setShowUserModal] = useState(false);

  return (
    <div className="w-full">
      <label className="block text-base font-semibold text-gray-900 dark:text-gray-300 mb-2">
        Participantes ({selectedUsers.length} seleccionados)
      </label>
      <button
        type="button"
        onClick={() => setShowUserModal(true)}
        className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 text-base font-semibold"
      >
        👥 Agregar Usuarios
      </button>
      {selectedUsers.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedUsers.map((user) => (
            <span
              key={user.id}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 text-sm rounded-full"
            >
              {user.name}
            </span>
          ))}
        </div>
      )}

      <UserSelectionModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        onConfirm={onUserSelection}
        initialSelectedIds={selectedUsers.map(u => u.id)}
      />
    </div>
  );
} 