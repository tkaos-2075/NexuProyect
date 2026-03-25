import { ReviewResponseDto } from "@interfaces/reviews/ReviewResponseDto";
import Api from "@services/api";

export async function getReviewById(id: number) {
  const api = await Api.getInstance();
  const response = await api.get<void, ReviewResponseDto>({
    url: `/reviews/${id}`
  });
  return response;
} 