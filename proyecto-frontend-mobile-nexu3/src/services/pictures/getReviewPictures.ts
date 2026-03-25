import Api from "@services/api";
import { PicturesResponseDto } from "@interfaces/pictures/PicturesResponseDto";

export async function getReviewPictures(reviewId: string): Promise<string[]> {
    const api = await Api.getInstance();
    const response = await api.get<void, PicturesResponseDto>({
        url: `/pictures/review?reviewId=${reviewId}`
    });
    return response.data.urls;
} 