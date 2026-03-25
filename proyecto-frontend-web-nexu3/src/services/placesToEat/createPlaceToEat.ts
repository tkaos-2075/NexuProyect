import { PlacesToEatRequestDto } from "@interfaces/placesToEat/PlacesToEatRequestDto";
import { PlacesToEatResponseDto } from "@interfaces/placesToEat/PlacesToEatResponseDto";
import Api from "@services/api";

export async function createPlaceToEat(place: PlacesToEatRequestDto) {
  const api = await Api.getInstance();
  const response = await api.post<PlacesToEatRequestDto, PlacesToEatResponseDto>(place, {
    url: "/places-to-eat"
  });
  return response;
} 