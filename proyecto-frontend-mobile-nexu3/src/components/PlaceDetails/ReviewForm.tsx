import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { useRoleCheck } from '@hooks/useRoleCheck';
import { createReview } from '@services/reviews/createReview';
import { uploadReviewPictures } from '@services/pictures/uploadReviewPictures';
import { urisToFiles } from '@utils/imageUtils';
import KeyboardAwareScrollView from '@components/KeyboardAwareScrollView';
import AlertToast from '@components/AlertToast';
import SimpleToast from '@components/SimpleToast';
import ReviewImagePicker from './ReviewImagePicker';

interface ReviewFormProps {
  placeId: number;
  onCancel: () => void;
  onReviewCreated?: () => void;
}

export default function ReviewForm({ placeId, onCancel, onReviewCreated }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUnauthorized, setShowUnauthorized] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const { isViewer, isUser, isAdmin } = useRoleCheck();

  // Verificar permisos al cargar el componente
  React.useEffect(() => {
    if (isViewer) {
      setShowUnauthorized(true);
    }
  }, [isViewer]);

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Por favor selecciona una calificación');
      return;
    }

    if (!comment.trim()) {
      Alert.alert('Error', 'Por favor escribe un comentario');
      return;
    }

    if (isViewer) {
      setToast({ message: 'No tienes permisos para crear reseñas', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    try {
      // Crear la review primero
      const reviewId = await createReview({
        rating,
        comment: comment.trim(),
        placeId
      });
      
      // Si hay imágenes seleccionadas, subirlas
      if (selectedImages.length > 0) {
        try {
          const imageFiles = await urisToFiles(selectedImages);
          await uploadReviewPictures(reviewId.toString(), imageFiles);
          console.log('Imágenes subidas exitosamente');
        } catch (imageError) {
          console.error('Error al subir imágenes:', imageError);
          // No fallar la review si las imágenes no se suben
          setToast({ message: 'Review creada pero hubo un problema al subir las imágenes', type: 'error' });
        }
      }
      
      setToast({ message: 'Reseña creada exitosamente', type: 'success' });
      setRating(0);
      setComment('');
      setSelectedImages([]);
      
      // Llamar callback para actualizar la lista de reseñas
      if (onReviewCreated) {
        onReviewCreated();
      }
      
      // Cerrar el formulario después de un breve delay
      setTimeout(() => {
        onCancel();
      }, 1500);
      
    } catch (error) {
      console.error('Error al enviar reseña:', error);
      setToast({ message: 'Error al crear la reseña', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => setRating(i)}
          disabled={isSubmitting}
          style={styles.starButton}
        >
          <Text style={[
            styles.starIcon,
            { color: i <= rating ? '#fbbf24' : '#e5e7eb' }
          ]}>
            ★
          </Text>
        </TouchableOpacity>
      );
    }
    return stars;
  };

  if (showUnauthorized) {
    return (
      <AlertToast
        message="No tienes permisos para dejar una review."
        onClose={() => {
          setShowUnauthorized(false);
          onCancel();
        }}
        duration={3000}
      />
    );
  }

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <Text style={styles.title}>Escribir Reseña</Text>
      
      <View style={styles.ratingSection}>
        <Text style={styles.label}>Calificación</Text>
        <View style={styles.starsContainer}>
          {renderStars()}
        </View>
        {rating > 0 && (
          <Text style={styles.ratingText}>
            {rating} estrella{rating > 1 ? 's' : ''}
          </Text>
        )}
      </View>

      <View style={styles.commentSection}>
        <Text style={styles.label}>Comentario</Text>
        <TextInput
          style={styles.commentInput}
          value={comment}
          onChangeText={setComment}
          placeholder="Comparte tu experiencia..."
          placeholderTextColor="#9ca3af"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          editable={!isSubmitting}
        />
      </View>

      {/* Componente de selección de imágenes */}
      <ReviewImagePicker
        images={selectedImages}
        onImagesChange={setSelectedImages}
        maxImages={5}
      />

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={isSubmitting}
        disabled={isSubmitting || rating === 0 || !comment.trim()}
        style={styles.submitButton}
        labelStyle={styles.submitButtonText}
      >
        {isSubmitting ? 'Enviando...' : 'Enviar Reseña'}
      </Button>

      {toast && (
        <SimpleToast
          message={toast.message}
          type={toast.type}
          onHide={() => setToast(null)}
        />
      )}
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 24,
    textAlign: 'center',
  },
  ratingSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  starButton: {
    marginHorizontal: 4,
  },
  starIcon: {
    fontSize: 32,
  },
  ratingText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  commentSection: {
    marginBottom: 24,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#1e293b',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#1e40af',
    borderRadius: 8,
    paddingVertical: 4,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 