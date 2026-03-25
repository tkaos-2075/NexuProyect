import { ReviewRequestDto } from "@interfaces/reviews/ReviewRequestDto";
import Api from "@services/api";

export async function createReview(review: ReviewRequestDto & { placeId: number }): Promise<number> {
  const api = await Api.getInstance();
  const response = await api.post<ReviewRequestDto, number>(review, {
    url: `/reviews?placeId=${review.placeId}`
  });
  return response.data;
} 