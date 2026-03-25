import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ReviewResponseDto } from '@interfaces/reviews/ReviewResponseDto';
import { likeReview } from '@services/reviews/likeReview';
import SimpleToast from '@components/SimpleToast';
import ReviewImageGallery from './ReviewImageGallery';

interface ReviewListProps {
  reviews: ReviewResponseDto[];
  onRefresh?: () => void;
  refreshing?: boolean;
}

export default function ReviewList({ reviews, onRefresh, refreshing = false }: ReviewListProps) {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text key={i} style={[
          styles.starIcon,
          { color: i <= rating ? '#fbbf24' : '#e5e7eb' }
        ]}>
          ★
        </Text>
      );
    }
    return stars;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleLikeReview = async (reviewId: number) => {
    try {
      await likeReview(reviewId);
      
      // Recargar las reviews para obtener los datos actualizados del backend
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error al dar like:', error);
      setToast({ message: 'Error al actualizar like', type: 'error' });
    }
  };



  const renderReview = (review: ReviewResponseDto) => {
    return (
      <View key={review.id} style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{review.userName}</Text>
            <Text style={styles.reviewDate}>{formatDate(review.createdAt)}</Text>
          </View>
          <View style={styles.ratingContainer}>
            {renderStars(review.rating)}
          </View>
        </View>
        
        {review.comment && (
          <Text style={styles.commentText}>{review.comment}</Text>
        )}

        {/* Mostrar imágenes si existen */}
        {review.pictureUrls && review.pictureUrls.length > 0 && (
          <ReviewImageGallery images={review.pictureUrls} />
        )}

        {/* Sección de likes */}
        <View style={styles.likesSection}>
          <TouchableOpacity
            style={styles.likeButton}
            onPress={() => handleLikeReview(review.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.likeIcon}>
              ❤️
            </Text>
            <Text style={styles.likesCount}>
              {review.likes}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (reviews.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No hay reseñas aún. ¡Sé el primero en compartir tu experiencia!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.reviewsList}>
        {reviews.map(renderReview)}
      </View>
      
      {toast && (
        <SimpleToast
          message={toast.message}
          type={toast.type}
          onHide={() => setToast(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  reviewsList: {
    gap: 12,
  },
  reviewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: '#64748b',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    fontSize: 16,
    marginLeft: 2,
  },
  commentText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  likesSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
  },
  likeIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  likesCount: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
}); 