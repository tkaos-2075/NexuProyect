import AddPlaceForm from '@components/forms/AddPlaceForm';

interface MapAddPlaceModalProps {
  isOpen: boolean;
  selectedCoords: { lat: number; lng: number } | null;
  onClose: () => void;
  onPlaceAdded?: () => void;
}

export default function MapAddPlaceModal({
  isOpen,
  selectedCoords,
  onClose,
}: MapAddPlaceModalProps) {
  if (!isOpen || !selectedCoords) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="relative w-full max-w-lg sm:max-w-xl max-h-[90vh] overflow-y-auto p-2">
        <AddPlaceForm
          onClose={onClose}
          lat={selectedCoords.lat}
          lng={selectedCoords.lng}
        />
      </div>
    </div>
  );
} 