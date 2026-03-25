import Api from "@services/api";

export async function deletePlaceToFun(id: number) {
  const api = await Api.getInstance();
  const response = await api.delete({
    url: `/places-to-fun/${id}`
  });
  return response;
} 