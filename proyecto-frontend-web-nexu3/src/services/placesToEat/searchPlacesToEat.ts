import { PlacesToEatResponseDto } from "@interfaces/placesToEat/PlacesToEatResponseDto";
import Api from "@services/api";

export interface SearchPlacesToEatParams {
  status?: string;
  category?: string;
  qualification?: number;
}

export async function searchPlacesToEat(params: SearchPlacesToEatParams) {
  const api = await Api.getInstance();
  const query = new URLSearchParams();
  if (params.status) query.append('status', params.status);
  if (params.category) query.append('category', params.category);
  if (params.qualification) query.append('qualification', params.qualification.toString());
  const response = await api.get<void, PlacesToEatResponseDto[]>({
    url: `/places-to-eat/search?${query.toString()}`
  });
  return response;
} 