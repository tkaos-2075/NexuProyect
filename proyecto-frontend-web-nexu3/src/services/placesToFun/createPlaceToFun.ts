import { PlacesToFunRequestDto } from "@interfaces/placesToFun/PlacesToFunRequestDto";
import { PlacesToFunResponseDto } from "@interfaces/placesToFun/PlacesToFunResponseDto";
import Api from "@services/api";

export async function createPlaceToFun(place: PlacesToFunRequestDto) {
  const api = await Api.getInstance();
  const response = await api.post<PlacesToFunRequestDto, PlacesToFunResponseDto>(place, {
    url: "/places-to-fun"
  });
  return response;
} 