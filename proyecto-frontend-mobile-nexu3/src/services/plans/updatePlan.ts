import { PlansRequestDto } from "@interfaces/plans/PlansRequestDto";
import { PlansResponseDto } from "@interfaces/plans/PlansResponseDto";
import Api from "@services/api";

export async function updatePlan(id: number, plan: PlansRequestDto) {
  const api = await Api.getInstance();
  const response = await api.put<PlansRequestDto, PlansResponseDto>(plan, {
    url: `/plans/${id}`
  });
  return response;
} 