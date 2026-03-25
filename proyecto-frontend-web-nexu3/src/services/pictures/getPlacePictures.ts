import Api from "@services/api";
import { PicturesResponseDto } from "@interfaces/pictures/PicturesResponseDto";

export async function getPlacePictures(placeId: string): Promise<string[]> {
    const api = await Api.getInstance();
    const response = await api.get<void, PicturesResponseDto>({
        url: `/pictures/place?placeId=${placeId}`
    });
    return response.data.urls;
} 