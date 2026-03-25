import { PlacesToFunResponseDto } from "@interfaces/placesToFun/PlacesToFunResponseDto";
import Api from "@services/api";

export async function getPlaceToFunById(id: number) {
  const api = await Api.getInstance();
  const response = await api.get<void, PlacesToFunResponseDto>({
    url: `/places-to-fun/${id}`
  });
  return response;
} 