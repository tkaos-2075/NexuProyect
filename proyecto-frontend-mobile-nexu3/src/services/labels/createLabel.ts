import { LabelsRequestDto } from "@interfaces/labels/LabelsRequestDto";
import { LabelsResponseDto } from "@interfaces/labels/LabelsResponseDto";
import Api from "@services/api";

export async function createLabel(label: LabelsRequestDto) {
  const api = await Api.getInstance();
  return api.post<LabelsRequestDto, LabelsResponseDto>(label, { url: "/labels" });
} 