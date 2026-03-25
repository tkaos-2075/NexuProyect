import React from 'react';

interface ProfileEditFormProps {
  editForm: {
    name: string;
    email: string;
    password: string;
    newPassword: string;
  };
  setEditForm: (fn: (prev: any) => any) => void;
  onSave: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ editForm, setEditForm, onSave, onCancel, loading }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Nombre
      </label>
      <input
        type="text"
        value={editForm.name}
        onChange={e => setEditForm((prev: any) => ({ ...prev, name: e.target.value }))}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
        disabled={loading}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Email
      </label>
      <input
        type="email"
        value={editForm.email}
        onChange={e => setEditForm((prev: any) => ({ ...prev, email: e.target.value }))}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
        disabled={loading}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Contraseña Actual <span className="text-red-500">*</span>
      </label>
      <input
        type="password"
        value={editForm.password}
        onChange={e => setEditForm((prev: any) => ({ ...prev, password: e.target.value }))}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
        placeholder="Ingresa tu contraseña actual"
        required
        disabled={loading}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Nueva Contraseña
      </label>
      <input
        type="password"
        value={editForm.newPassword}
        onChange={e => setEditForm((prev: any) => ({ ...prev, newPassword: e.target.value }))}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
        placeholder="Dejar en blanco para no cambiar"
        disabled={loading}
      />
    </div>
    <div className="flex space-x-3 pt-4">
      <button
        onClick={onSave}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        disabled={loading}
      >
        Guardar
      </button>
      <button
        onClick={onCancel}
        className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        disabled={loading}
      >
        Cancelar
      </button>
    </div>
  </div>
);

export default ProfileEditForm; 