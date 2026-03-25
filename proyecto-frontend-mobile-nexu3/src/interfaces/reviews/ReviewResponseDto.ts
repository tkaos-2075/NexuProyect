export interface ReviewResponseDto {
  id: number;
  comment: string;
  rating: number;
  likes: number;
  createdAt: string; // ISO string (YYYY-MM-DDTHH:mm:ss)
  userName: string;
  userId: number;
  placeName: string;
  placeId: number;
  pictureUrls: string[];
} 