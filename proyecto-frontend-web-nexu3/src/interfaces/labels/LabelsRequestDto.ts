export interface LabelsRequestDto {
  name: string;
  description?: string;
  color: string;
  status?: LabelsStatus;
}

export type LabelsStatus = 'ACTIVE' | 'INACTIVE'; 