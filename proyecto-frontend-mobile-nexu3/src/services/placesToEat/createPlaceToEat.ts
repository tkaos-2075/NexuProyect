import { PlacesToEatRequestDto } from "@interfaces/placesToEat/PlacesToEatRequestDto";
import Api from "@services/api";

export async function createPlaceToEat(place: PlacesToEatRequestDto) {
  const api = await Api.getInstance();
  const response = await api.post<PlacesToEatRequestDto, void>(place, {
    url: "/places-to-eat"
  });
  return response;
} 