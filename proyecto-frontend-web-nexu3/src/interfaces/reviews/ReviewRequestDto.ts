export interface ReviewRequestDto {
  comment: string;
  rating: number;
  pictures?: string[]; // Asumimos que se envían URLs o IDs de imágenes
} 