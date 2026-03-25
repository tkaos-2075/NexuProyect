import BaseModal from "./BaseModal";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "¿Estás seguro?",
  message = "Esta acción no se puede deshacer.",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  loading = false
}: ConfirmModalProps) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="py-4">
        <p className="text-gray-700 dark:text-gray-300 text-center">{message}</p>
      </div>
      <div className="flex justify-end space-x-3 mt-6">
        <button
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200"
        >
          {loading ? "Procesando..." : confirmText}
        </button>
      </div>
    </BaseModal>
  );
} 