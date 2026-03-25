import { PlacesToFunRequestDto } from "@interfaces/placesToFun/PlacesToFunRequestDto";
import Api from "@services/api";

export async function createPlaceToFun(place: PlacesToFunRequestDto) {
  const api = await Api.getInstance();
  const response = await api.post<PlacesToFunRequestDto, void>(place, {
    url: "/places-to-fun"
  });
  return response;
} 