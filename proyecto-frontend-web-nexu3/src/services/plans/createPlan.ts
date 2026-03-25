import { PlansRequestDto } from "@interfaces/plans/PlansRequestDto";
import Api from "@services/api";

export async function createPlan(plan: PlansRequestDto) {
  const api = await Api.getInstance();
  const response = await api.post<PlansRequestDto, void>(plan, {
    url: "/plans"
  });
  return response;
} 