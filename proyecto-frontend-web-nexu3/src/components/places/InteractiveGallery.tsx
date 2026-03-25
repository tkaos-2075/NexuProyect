import { useState } from "react";
import ImageUploader from '../common/ImageUploader';
import ImagePreview from '../common/ImagePreview';
import { useImageUpload } from '@hooks/useImageUpload';

interface InteractiveGalleryProps {
  title: string;
  urls: string[];
  onImageClick: (url: string) => void;
  onUploadImages?: (files: File[]) => void;
  isUploading?: boolean;
  canUpload?: boolean;
}

export default function InteractiveGallery({ 
  title, 
  urls, 
  onImageClick, 
  onUploadImages,
  isUploading = false,
  canUpload = false
}: InteractiveGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Hook para manejo de imágenes
  const {
    images,
    handleUpload
  } = useImageUpload({
    onUpload: onUploadImages,
    initialImages: urls
  });

  // Navegación de imágenes
  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };
  
  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          📸 {title} ({images.length})
        </h3>
        
        <ImageUploader
          onUpload={handleUpload}
          isUploading={isUploading}
          canUpload={canUpload}
        />
      </div>

      {/* Galería de imágenes */}
      {images.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">📷</div>
          <p>No hay imágenes aún</p>
          {canUpload && <p className="text-sm">¡Sé el primero en agregar fotos!</p>}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Vista principal de imagen */}
          <div className="relative">
            <img
              src={images[currentIndex]}
              alt={`Imagen ${currentIndex + 1}`}
              className="w-full h-64 object-cover rounded-lg cursor-pointer"
              onClick={() => onImageClick(images[currentIndex])}
            />
            
            {/* Controles de navegación */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                >
                  ‹
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                >
                  ›
                </button>
              </>
            )}
            
            {/* Indicador de posición */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          </div>

          {/* Preview de todas las imágenes */}
          <ImagePreview
            images={images}
            onImageClick={(url) => {
              const index = images.indexOf(url);
              if (index !== -1) {
                setCurrentIndex(index);
              }
            }}
            maxDisplay={6}
          />
        </div>
      )}
    </div>
  );
} 