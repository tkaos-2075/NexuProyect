import { ReviewResponseDto } from "@interfaces/reviews/ReviewResponseDto";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";

interface ReviewsSectionProps {
  reviews: ReviewResponseDto[];
  showReviewForm: boolean;
  setShowReviewForm: React.Dispatch<React.SetStateAction<boolean>>;
  reviewForm: { comment: string; rating: number; pictures: File[] };
  setReviewForm: React.Dispatch<React.SetStateAction<{ comment: string; rating: number; pictures: File[] }>>;
  isSubmittingReview: boolean;
  isUploadingImages: boolean;
  handleSubmitReview: () => Promise<void>;
  renderStars: (rating: number) => JSX.Element[];
  formatDate: (dateString: string) => string;
  setSelectedImage: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function ReviewsSection({
  reviews,
  showReviewForm,
  setShowReviewForm,
  reviewForm,
  setReviewForm,
  isSubmittingReview,
  isUploadingImages,
  handleSubmitReview,
  renderStars,
  formatDate,
  setSelectedImage
}: ReviewsSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Opiniones de Usuarios</h3>
        <button
          onClick={() => setShowReviewForm((v: boolean) => !v)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
        >
          {showReviewForm ? 'Cancelar' : '+ Agregar Review'}
        </button>
      </div>
      {showReviewForm && (
        <ReviewForm
          reviewForm={reviewForm}
          setReviewForm={setReviewForm}
          isSubmittingReview={isSubmittingReview}
          isUploadingImages={isUploadingImages}
          onSubmit={handleSubmitReview}
          onCancel={() => setShowReviewForm(false)}
        />
      )}
      <ReviewList
        reviews={reviews}
        renderStars={renderStars}
        formatDate={formatDate}
        onImageClick={setSelectedImage}
      />
    </div>
  );
} 