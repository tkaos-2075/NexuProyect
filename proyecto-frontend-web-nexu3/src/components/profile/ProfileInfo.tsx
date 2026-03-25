import React from 'react';
import { UsersResponseDto } from '@interfaces/user/UsersResponseDto';

interface ProfileInfoProps {
  user: UsersResponseDto;
  isEditing: boolean;
  onEdit: () => void;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ user, isEditing, onEdit, getStatusColor, getStatusText }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        Información Personal
      </h2>
      {!isEditing && (
        <button
          onClick={onEdit}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          Editar
        </button>
      )}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Estado
        </label>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
          {getStatusText(user.status)}
        </span>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Nombre
        </label>
        <p className="text-gray-900 dark:text-white">{user.name}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Email
        </label>
        <p className="text-gray-900 dark:text-white">{user.email}</p>
      </div>
    </div>
  </div>
);

export default ProfileInfo; 