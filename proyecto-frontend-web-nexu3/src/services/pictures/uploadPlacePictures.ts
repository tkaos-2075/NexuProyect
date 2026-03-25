import Api from "@services/api";

export async function uploadPlacePictures(placeId: string, files: File[]): Promise<void> {
    const api = await Api.getInstance();
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    
    await api.post<FormData, void>(formData, {
        url: `/pictures/place?placeId=${placeId}`
    });
} 