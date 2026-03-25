interface ImagePreviewProps {
  images: string[];
  onImageClick?: (url: string) => void;
  className?: string;
  maxDisplay?: number;
  showCount?: boolean;
}

export default function ImagePreview({
  images,
  onImageClick,
  className = "",
  maxDisplay = 6,
}: ImagePreviewProps) {
  const validImages = images.filter(url => url && url !== null);
  const displayImages = validImages.slice(0, maxDisplay);
  const remainingCount = validImages.length - maxDisplay;

  if (validImages.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 dark:text-gray-400 ${className}`}>
        <div className="text-4xl mb-2">📷</div>
        <p>No hay imágenes aún</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 gap-2 ${className}`}>
      {displayImages.map((url, index) => (
        <div key={index} className="relative group">
          <img
            src={url}
            alt={`Imagen ${index + 1}`}
            className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onImageClick?.(url)}
          />
          {index === maxDisplay - 1 && remainingCount > 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold">+{remainingCount}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 