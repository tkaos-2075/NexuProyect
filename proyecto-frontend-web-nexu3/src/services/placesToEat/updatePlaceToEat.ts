import { PlacesToEatRequestDto } from "@interfaces/placesToEat/PlacesToEatRequestDto";
import { PlacesToEatResponseDto } from "@interfaces/placesToEat/PlacesToEatResponseDto";
import Api from "@services/api";

export async function updatePlaceToEat(id: number, place: PlacesToEatRequestDto) {
  const api = await Api.getInstance();
  const response = await api.put<PlacesToEatRequestDto, PlacesToEatResponseDto>(place, {
    url: `/places-to-eat/${id}`
  });
  return response;
} 