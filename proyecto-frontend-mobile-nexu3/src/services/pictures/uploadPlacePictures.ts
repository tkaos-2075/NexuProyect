import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function uploadPlacePictures(placeId: string, files: File[]): Promise<void> {
    const formData = new FormData();
    
    files.forEach((file) => {
        formData.append('files', file);
    });
    
    try {
        // Obtener el token del AsyncStorage
        const token = await AsyncStorage.getItem("token");
        const basePath = process.env.EXPO_PUBLIC_API_BASE_URL;
        
        const headers: any = {};
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
        
        await axios.post(`${basePath}/pictures/place?placeId=${placeId}`, formData, {
            headers: headers
        });
    } catch (error) {
        console.error("Error en uploadPlacePictures:", error);
        throw error;
    }
} 