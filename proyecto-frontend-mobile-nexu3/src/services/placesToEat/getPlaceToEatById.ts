import { PlacesToEatResponseDto } from "@interfaces/placesToEat/PlacesToEatResponseDto";
import Api from "@services/api";

export async function getPlaceToEatById(id: number) {
  const api = await Api.getInstance();
  const response = await api.get<void, PlacesToEatResponseDto>({
    url: `/places-to-eat/${id}`
  });
  return response;
} 