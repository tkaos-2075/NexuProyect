import Api from "@services/api";

export async function deletePlaceToEat(id: number) {
  const api = await Api.getInstance();
  const response = await api.delete({
    url: `/places-to-eat/${id}`
  });
  return response;
} 