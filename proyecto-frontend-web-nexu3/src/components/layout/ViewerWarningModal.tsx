interface ViewerWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToLogin: () => void;
}

export default function ViewerWarningModal({ isOpen, onClose, onGoToLogin }: ViewerWarningModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mr-3">
            <span className="text-yellow-600 dark:text-yellow-400 text-xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Acceso Restringido
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Como usuario viewer, no tienes acceso a la página de perfil. Para acceder a todas las funcionalidades, inicia sesión con una cuenta registrada.
        </p>
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={onGoToLogin}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ir a Login
          </button>
        </div>
      </div>
    </div>
  );
} 