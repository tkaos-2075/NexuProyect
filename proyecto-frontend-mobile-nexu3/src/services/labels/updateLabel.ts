import { LabelsRequestDto } from "@interfaces/labels/LabelsRequestDto";
import { LabelsResponseDto } from "@interfaces/labels/LabelsResponseDto";
import Api from "@services/api";

export async function updateLabel(id: number, label: LabelsRequestDto) {
  const api = await Api.getInstance();
  return api.put<LabelsRequestDto, LabelsResponseDto>(label, { url: `/labels/${id}` });
} 