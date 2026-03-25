import Api from "@services/api";

export async function deletePlan(id: number) {
  const api = await Api.getInstance();
  const response = await api.delete({
    url: `/plans/${id}`
  });
  return response;
} 