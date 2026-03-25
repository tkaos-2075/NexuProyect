// Formulario para dejar una reseña sobre un lugar en NexU
import React from "react";
import { AuthorizationGuard, FormField, ImageUploader } from '@components/common';
import { useToast } from '@components/ui/SimpleToast';

interface ReviewFormProps {
  reviewForm: {
    comment: string;
    rating: number;
    pictures: File[];
  };
  setReviewForm: React.Dispatch<React.SetStateAction<{
    comment: string;
    rating: number;
    pictures: File[];
  }>>;
  isSubmittingReview: boolean;
  isUploadingImages?: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function ReviewForm({
  reviewForm,
  setReviewForm,
  isSubmittingReview,
  isUploadingImages = false,
  onSubmit,
  onCancel,
}: ReviewFormProps) {
  const { ToastContainer } = useToast();
  
  // Maneja cambios en los campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setReviewForm(prev => ({ ...prev, [name]: value }));
  };

  // Maneja la subida de imágenes
  const handleImageUpload = (files: File[]) => {
    setReviewForm(prev => ({
      ...prev,
      pictures: [...prev.pictures, ...files]
    }));
  };

  // Elimina una imagen seleccionada
  const removePicture = (index: number) => {
    setReviewForm(prev => ({
      ...prev,
      pictures: prev.pictures.filter((_, i) => i !== index)
    }));
  };

  return (
    <AuthorizationGuard requiredRole="VIEWER" message="No tienes permisos para dejar una review.">
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Tu opinión</h4>
        
        {/* Calificación con estrellas */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Calificación
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setReviewForm((prev) => ({ ...prev, rating: star }))}
                className={`text-2xl transition-colors ${star <= reviewForm.rating ? "text-yellow-400" : "text-gray-300"}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        
        {/* Comentario */}
        <FormField
          label="Comentario"
          name="comment"
          type="textarea"
          value={reviewForm.comment}
          onChange={handleChange}
          placeholder="Comparte tu experiencia..."
          required
        />
        
        {/* Subida de fotos */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Fotos (opcional)
          </label>
          <ImageUploader
            onUpload={handleImageUpload}
            isUploading={isUploadingImages}
            canUpload={true}
            multiple={true}
            accept="image/*"
          />
          
          {/* Preview de imágenes seleccionadas */}
          {reviewForm.pictures.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {reviewForm.pictures.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removePicture(index)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Botones de acción */}
        <div className="flex space-x-3">
          <button
            onClick={onSubmit}
            disabled={isSubmittingReview || isUploadingImages || !reviewForm.comment.trim()}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 transition-colors"
          >
            {isUploadingImages ? "Subiendo imágenes..." : isSubmittingReview ? "Enviando..." : "Enviar Review"}
          </button>
          <button
            onClick={onCancel}
            disabled={isSubmittingReview || isUploadingImages}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:bg-gray-400 disabled:text-gray-500 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
      <ToastContainer />
    </AuthorizationGuard>
  );
} 