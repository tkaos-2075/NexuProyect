export interface PlansResponseDto {
  id: number;
  name: string;
  description?: string;
  startDate?: string; // ISO string (YYYY-MM-DD)
  endDate?: string;   // ISO string (YYYY-MM-DD)
  createdDate?: string; // ISO string (YYYY-MM-DDTHH:mm:ss)
  visibility: VisibilityPlans;
  usersId: number[];
  placesId: number[];
  creatorId: number;
}

import { VisibilityPlans } from './PlansRequestDto'; 