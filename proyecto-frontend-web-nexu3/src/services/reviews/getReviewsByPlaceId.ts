import { ReviewResponseDto } from "@interfaces/reviews/ReviewResponseDto";
import Api from "@services/api";

export async function getReviewsByPlaceId(placeId: number) {
  const api = await Api.getInstance();
  const response = await api.get<void, ReviewResponseDto[]>({
    url: `/reviews/place/${placeId}`
  });
  return response;
} 