// Modal para mostrar una imagen ampliada en NexU
interface ImageModalProps {
  url: string;
  onClose: () => void;
}

export default function ImageModal({ url, onClose }: ImageModalProps) {
  if (!url) return null;

  // Permite cerrar con ESC
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Botón de cerrar */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75 transition-all duration-200 text-xl"
        aria-label="Cerrar"
      >
        ×
      </button>
      {/* Imagen ampliada */}
      <div className="relative w-full h-full flex items-center justify-center">
        <img
          src={url}
          alt="Vista ampliada"
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          onClick={e => e.stopPropagation()}
          style={{
            maxWidth: '95vw',
            maxHeight: '95vh'
          }}
        />
      </div>
      {/* Indicador de cierre */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full">
        Presiona ESC o haz clic para cerrar
      </div>
    </div>
  );
} 