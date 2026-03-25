import { AssignLabelToPlaceResponse } from "@interfaces/labels/AssignLabelToPlaceResponse";
import Api from "@services/api";

export async function assignLabelToPlace(labelId: number, placeId: number) {
  const api = await Api.getInstance();
  return api.post<undefined, AssignLabelToPlaceResponse>(undefined, { url: `/labels/${labelId}/assign-to-place/${placeId}` });
} 