import Api from "@services/api";

export async function likeReview(id: number) {
  const api = await Api.getInstance();
  const response = await api.patch<void, void>(undefined, {
    url: `/reviews/${id}/like`
  });
  return response;
} 