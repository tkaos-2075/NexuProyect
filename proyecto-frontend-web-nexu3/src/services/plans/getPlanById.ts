import { PlansResponseDto } from "@interfaces/plans/PlansResponseDto";
import Api from "@services/api";

export async function getPlanById(id: number) {
  const api = await Api.getInstance();
  const response = await api.get<void, PlansResponseDto>({
    url: `/plans/${id}`
  });
  return response;
} 