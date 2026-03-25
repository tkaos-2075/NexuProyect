import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ImageFile } from '@utils/imageUtils';

export async function uploadReviewPictures(reviewId: string, files: ImageFile[]): Promise<void> {
    console.log("uploadReviewPictures llamado con reviewId:", reviewId, "y", files.length, "archivos");
    
    const formData = new FormData();
    
    files.forEach((file, index) => {
        console.log(`Agregando archivo ${index + 1}:`, file.name, file.type);
        
        // Crear el objeto File para React Native
        const fileData = {
            uri: file.uri,
            name: file.name,
            type: file.type,
        } as any;
        
        formData.append('files', fileData);
    });
    
    console.log("FormData creado, enviando petición...");
    
    try {
        // Obtener el token del AsyncStorage
        const token = await AsyncStorage.getItem("token");
        const basePath = process.env.EXPO_PUBLIC_API_BASE_URL;
        
        const headers: any = {
            'Content-Type': 'multipart/form-data',
        };
        
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
        
        await axios.post(`${basePath}/pictures/review?reviewId=${reviewId}`, formData, {
            headers: headers
        });
        
        console.log("Petición de subida de imágenes completada exitosamente");
    } catch (error) {
        console.error("Error en uploadReviewPictures:", error);
        throw error;
    }
} 