import React from 'react';

interface ProfileDangerZoneProps {
  onDelete: () => void;
  onCancel: () => void;
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: (show: boolean) => void;
}

const ProfileDangerZone: React.FC<ProfileDangerZoneProps> = ({ onDelete, onCancel, showDeleteConfirm, setShowDeleteConfirm }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
      Acciones de Cuenta
    </h2>
    <div className="space-y-4">
      <div className="border border-red-200 dark:border-red-800 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
        <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
          Zona de Peligro
        </h3>
        <p className="text-red-600 dark:text-red-400 mb-4">
          Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, ten cuidado.
        </p>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Eliminar Cuenta
        </button>
      </div>
    </div>
    {/* Modal de confirmación de eliminación */}
    {showDeleteConfirm && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            ¿Estás seguro?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Esta acción no se puede deshacer. Se eliminará permanentemente tu cuenta y todos tus datos.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={onDelete}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              Sí, eliminar
            </button>
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);

export default ProfileDangerZone; 