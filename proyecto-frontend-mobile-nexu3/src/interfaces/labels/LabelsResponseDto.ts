import { LabelsStatus } from './LabelsRequestDto';

export interface LabelsResponseDto {
  id: number;
  name: string;
  description?: string;
  color: string;
  status: LabelsStatus;
  placeIds: number[];
} 