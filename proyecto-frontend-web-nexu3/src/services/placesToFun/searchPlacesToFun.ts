import { PlacesToFunResponseDto } from "@interfaces/placesToFun/PlacesToFunResponseDto";
import Api from "@services/api";

export interface SearchPlacesToFunParams {
  status?: string;
  category?: string;
  qualification?: number;
}

export async function searchPlacesToFun(params: SearchPlacesToFunParams) {
  const api = await Api.getInstance();
  const query = new URLSearchParams();
  if (params.status) query.append('status', params.status);
  if (params.category) query.append('category', params.category);
  if (params.qualification) query.append('qualification', params.qualification.toString());
  const response = await api.get<void, PlacesToFunResponseDto[]>({
    url: `/places-to-fun/search?${query.toString()}`
  });
  return response;
} 