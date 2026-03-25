export interface PlansRequestDto {
  name: string;
  description?: string;
  startDate?: string; // ISO string (YYYY-MM-DD)
  endDate?: string;   // ISO string (YYYY-MM-DD)
  visibility?: VisibilityPlans;
  usersId?: number[];
  placesId?: number[];
}

export type VisibilityPlans = 'PUBLIC' | 'PRIVATE' | 'RESTRICTED'; 