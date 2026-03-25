import { PlacesToEatResponseDto } from "@interfaces/placesToEat/PlacesToEatResponseDto";
import Api from "@services/api";

export async function getOpenActuallyPlacesToEat() {
  const api = await Api.getInstance();
  const response = await api.get<void, PlacesToEatResponseDto[]>({
    url: `/places-to-eat/open-actually`
  });
  return response;
} 