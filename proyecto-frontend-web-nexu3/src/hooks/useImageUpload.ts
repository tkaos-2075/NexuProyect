import { useState } from 'react';

interface UseImageUploadProps {
  onUpload?: (files: File[]) => void;
  initialImages?: string[];
}

export function useImageUpload({ onUpload, initialImages = [] }: UseImageUploadProps) {
  const [images, setImages] = useState<string[]>(initialImages);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (files: File[]) => {
    if (!onUpload) return;
    
    setIsUploading(true);
    try {
      await onUpload(files);
      // Aquí podrías actualizar las imágenes si el servidor devuelve las URLs
      // Por ahora, simulamos que se agregaron las imágenes
      const newImageUrls = files.map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImageUrls]);
    } catch (error) {
      console.error('Error al subir imágenes:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const clearImages = () => {
    setImages([]);
  };

  return {
    images,
    isUploading,
    handleUpload,
    removeImage,
    clearImages,
    setImages,
  };
} 