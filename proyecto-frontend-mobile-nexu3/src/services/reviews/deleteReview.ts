import Api from "@services/api";

export async function deleteReview(id: number) {
  const api = await Api.getInstance();
  const response = await api.delete({
    url: `/reviews/${id}`
  });
  return response;
} 