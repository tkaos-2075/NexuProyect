import ConfirmModal from '../common/ConfirmModal';

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function UnsavedChangesModal({
  isOpen,
  onConfirm,
  onCancel
}: UnsavedChangesModalProps) {
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onCancel}
      onConfirm={onConfirm}
      title="Cambios no guardados"
      message="Tienes cambios sin guardar en tu plan. Si sales ahora, perderás todos los cambios realizados.\n💡 Sugerencia: Considera guardar tu plan como borrador antes de salir."
      confirmText="Salir sin guardar"
      cancelText="Cancelar"
    />
  );
} 