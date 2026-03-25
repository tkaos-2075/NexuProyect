import Api from "@services/api";

export async function addFavoritePlaceToFun(placeId: number, userId: number) {
  const api = await Api.getInstance();
  const response = await api.post<void, string>(undefined, {
    url: `/places-to-fun/${placeId}/favorite?userId=${userId}`
  });
  return response;
}

export async function removeFavoritePlaceToFun(placeId: number, userId: number) {
  const api = await Api.getInstance();
  const response = await api.delete({
    url: `/places-to-fun/${placeId}/favorite?userId=${userId}`
  });
  return response;
} 