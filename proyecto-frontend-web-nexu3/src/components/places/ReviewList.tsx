// Lista de reviews para un lugar en NexU
import { ReviewResponseDto } from "@interfaces/reviews/ReviewResponseDto";
import { likeReview } from "@services/reviews/likeReview";
import { useState } from "react";

interface ReviewListProps {
  reviews: ReviewResponseDto[];
  renderStars: (rating: number) => JSX.Element[];
  formatDate: (dateString: string) => string;
  onImageClick: (url: string) => void;
}

export default function ReviewList({ reviews, renderStars, formatDate, onImageClick }: ReviewListProps) {
  const [likes, setLikes] = useState<{ [key: number]: number }>({});
  const [liking, setLiking] = useState<{ [key: number]: boolean }>({});

  const handleLike = async (reviewId: number) => {
    if (liking[reviewId]) return; // evitar doble click rápido
    setLiking((prev) => ({ ...prev, [reviewId]: true }));
    try {
      await likeReview(reviewId);
      setLikes((prev) => ({
        ...prev,
        [reviewId]: (prev[reviewId] ?? reviews.find(r => r.id === reviewId)?.likes ?? 0) + 1
      }));
    } catch {
      // Podrías mostrar un toast de error aquí
    } finally {
      setLiking((prev) => ({ ...prev, [reviewId]: false }));
    }
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <div className="text-4xl mb-4">💬</div>
        <p>No hay reviews aún</p>
        <p className="text-sm">¡Sé el primero en dejar una opinión!</p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                {review.userName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {review.userName || 'Usuario'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(review.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              {renderStars(review.rating)}
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            {review.comment}
          </p>
          {review.pictureUrls && review.pictureUrls.length > 0 && (
            <div className="flex space-x-2 overflow-x-auto">
              {review.pictureUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Review ${index + 1}`}
                  className="w-16 h-16 object-cover rounded-lg cursor-pointer"
                  onClick={() => onImageClick(url)}
                />
              ))}
            </div>
          )}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <button
              className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors disabled:opacity-50"
              onClick={() => handleLike(review.id)}
              disabled={liking[review.id]}
            >
              <span>👍</span>
              <span className="text-sm">{likes[review.id] ?? review.likes ?? 0}</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
} 