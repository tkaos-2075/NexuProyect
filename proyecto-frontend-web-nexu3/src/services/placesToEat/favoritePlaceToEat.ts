import Api from "@services/api";

export async function addFavoritePlaceToEat(placeId: number, userId: number) {
  const api = await Api.getInstance();
  const response = await api.post<void, string>(undefined, {
    url: `/places-to-eat/${placeId}/favorite?userId=${userId}`
  });
  return response;
}

export async function removeFavoritePlaceToEat(placeId: number, userId: number) {
  const api = await Api.getInstance();
  const response = await api.delete({
    url: `/places-to-eat/${placeId}/favorite?userId=${userId}`
  });
  return response;
} 