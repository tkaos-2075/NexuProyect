import { ReviewRequestDto } from "@interfaces/reviews/ReviewRequestDto";
import Api from "@services/api";

export async function updateReview(id: number, review: ReviewRequestDto) {
  const api = await Api.getInstance();
  const response = await api.put<ReviewRequestDto, void>(review, {
    url: `/reviews/${id}`
  });
  return response;
} 