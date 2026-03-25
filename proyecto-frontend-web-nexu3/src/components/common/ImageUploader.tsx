import React, { useState } from 'react';

interface ImageUploaderProps {
  onUpload: (files: File[]) => void;
  isUploading?: boolean;
  canUpload?: boolean;
  multiple?: boolean;
  accept?: string;
  className?: string;
}

export default function ImageUploader({
  onUpload,
  isUploading = false,
  canUpload = false,
  multiple = true,
  accept = "image/*",
  className = ""
}: ImageUploaderProps) {
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
    }
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      onUpload(selectedFiles);
      setSelectedFiles([]);
      setShowUpload(false);
    }
  };

  const handleCancel = () => {
    setSelectedFiles([]);
    setShowUpload(false);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  if (!canUpload) return null;

  return (
    <div className={className}>
      {/* Botón para mostrar/ocultar subida */}
      <button
        onClick={() => setShowUpload(!showUpload)}
        className="text-sm bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors"
      >
        + Agregar
      </button>

      {/* Panel de subida */}
      {showUpload && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <input
            type="file"
            multiple={multiple}
            accept={accept}
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white mb-2"
          />
          
          {/* Preview de imágenes seleccionadas */}
          {selectedFiles.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2 mb-3">
              {selectedFiles.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* Botones de acción */}
          <div className="flex space-x-2">
            <button
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || isUploading}
              className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:bg-gray-400 transition-colors"
            >
              {isUploading ? "Subiendo..." : "Subir"}
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 