import { PlacesToFunRequestDto } from "@interfaces/placesToFun/PlacesToFunRequestDto";
import { PlacesToFunResponseDto } from "@interfaces/placesToFun/PlacesToFunResponseDto";
import Api from "@services/api";

export async function updatePlaceToFun(id: number, place: PlacesToFunRequestDto) {
  const api = await Api.getInstance();
  const response = await api.put<PlacesToFunRequestDto, PlacesToFunResponseDto>(place, {
    url: `/places-to-fun/${id}`
  });
  return response;
} 