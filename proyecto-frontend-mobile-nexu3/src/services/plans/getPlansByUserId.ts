import { PlansResponseDto } from "@interfaces/plans/PlansResponseDto";
import Api from "@services/api";

export async function getPlansByUserId(userId: number) {
  const api = await Api.getInstance();
  const response = await api.get<void, PlansResponseDto[]>({
    url: `/plans/me/${userId}`
  });
  return response;
} 