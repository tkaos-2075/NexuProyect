import { LabelsResponseDto } from "@interfaces/labels/LabelsResponseDto";
import Api from "@services/api";

export async function getAllLabels() {
  const api = await Api.getInstance();
  return api.get<undefined, LabelsResponseDto[]>({ url: "/labels" });
} 