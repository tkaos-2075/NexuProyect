export interface User {
  id: number;
  name: string;
  email: string;
  username?: string;
}

export interface CreatePlanFormProps {
  places: (PlacesToEatResponseDto | PlacesToFunResponseDto)[];
  onClose: () => void;
  onPlanCreated?: () => void;
  onSubmit: (name: string, description: string) => Promise<void>;
  isLoading?: boolean;
  initialName?: string;
  initialDescription?: string;
  submitText?: string;
}

// Importaciones necesarias
import { PlacesToEatResponseDto } from '@interfaces/placesToEat/PlacesToEatResponseDto';
import { PlacesToFunResponseDto } from '@interfaces/placesToFun/PlacesToFunResponseDto'; 