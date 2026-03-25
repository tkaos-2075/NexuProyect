import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import { ReviewResponseDto } from '@interfaces/reviews/ReviewResponseDto';

interface ReviewsSectionProps {
  reviews: ReviewResponseDto[];
  placeId: number;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export default function ReviewsSection({ 
  reviews, 
  placeId, 
  onRefresh, 
  refreshing = false 
}: ReviewsSectionProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const handleCancelReview = () => {
    setShowReviewForm(false);
  };

  const handleReviewCreated = () => {
    setShowReviewForm(false);
    onRefresh?.();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>💬 Reseñas</Text>
        <TouchableOpacity
          style={styles.addReviewButton}
          onPress={() => setShowReviewForm(true)}
        >
          <Text style={styles.addReviewButtonText}>✏️ Añadir</Text>
        </TouchableOpacity>
      </View>

      {showReviewForm && (
        <ReviewForm
          placeId={placeId}
          onCancel={handleCancelReview}
          onReviewCreated={handleReviewCreated}
        />
      )}

      <View style={styles.reviewsContainer}>
        <ReviewList
          reviews={reviews}
          onRefresh={onRefresh}
          refreshing={refreshing}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  addReviewButton: {
    backgroundColor: '#1e40af',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#1e40af',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addReviewButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  reviewsContainer: {
    flex: 1,
  },
}); 