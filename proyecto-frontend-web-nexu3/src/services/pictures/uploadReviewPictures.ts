import Api from "@services/api";

export async function uploadReviewPictures(reviewId: string, files: File[]): Promise<void> {
    console.log("uploadReviewPictures llamado con reviewId:", reviewId, "y", files.length, "archivos");
    
    const api = await Api.getInstance();
    const formData = new FormData();
    
    files.forEach((file, index) => {
        console.log(`Agregando archivo ${index + 1}:`, file.name, file.type, file.size);
        formData.append('files', file);
    });
    
    console.log("FormData creado, enviando petición...");
    
    try {
        await api.post<FormData, void>(formData, {
            url: `/pictures/review?reviewId=${reviewId}`
        });
        
        console.log("Petición de subida de imágenes completada exitosamente");
    } catch (error) {
        console.error("Error en uploadReviewPictures:", error);
        throw error;
    }
} 