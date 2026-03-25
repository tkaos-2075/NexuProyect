import * as FileSystem from 'expo-file-system';

export interface ImageFile {
  uri: string;
  name: string;
  type: string;
}

export async function uriToFile(uri: string, fileName: string): Promise<ImageFile> {
  try {
    // Obtener información del archivo
    const fileInfo = await FileSystem.getInfoAsync(uri);
    
    if (!fileInfo.exists) {
      throw new Error('El archivo no existe');
    }

    // Determinar el tipo MIME basado en la extensión
    const extension = uri.split('.').pop()?.toLowerCase();
    let mimeType = 'image/jpeg'; // Por defecto
    
    switch (extension) {
      case 'png':
        mimeType = 'image/png';
        break;
      case 'gif':
        mimeType = 'image/gif';
        break;
      case 'webp':
        mimeType = 'image/webp';
        break;
      case 'jpg':
      case 'jpeg':
      default:
        mimeType = 'image/jpeg';
        break;
    }

    return {
      uri,
      name: fileName,
      type: mimeType,
    };
  } catch (error) {
    console.error('Error al convertir URI a archivo:', error);
    throw error;
  }
}

export async function urisToFiles(uris: string[]): Promise<ImageFile[]> {
  const files: ImageFile[] = [];
  
  for (let i = 0; i < uris.length; i++) {
    const uri = uris[i];
    const fileName = `review_image_${Date.now()}_${i}.jpg`;
    
    try {
      const file = await uriToFile(uri, fileName);
      files.push(file);
    } catch (error) {
      console.error(`Error al procesar imagen ${i}:`, error);
      // Continuar con las siguientes imágenes
    }
  }
  
  return files;
} 