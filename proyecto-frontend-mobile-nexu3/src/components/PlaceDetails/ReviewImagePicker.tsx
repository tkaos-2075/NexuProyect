import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, ScrollView } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import * as ExpoImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

interface ReviewImagePickerProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ReviewImagePicker({ images, onImagesChange, maxImages = 5 }: ReviewImagePickerProps) {
  const [isLoading, setIsLoading] = useState(false);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ExpoImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
    
    if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
      Alert.alert(
        'Permisos requeridos',
        'Necesitamos acceso a la cámara y galería para seleccionar imágenes.'
      );
      return false;
    }
    return true;
  };

  const handleTakePhoto = async () => {
    if (images.length >= maxImages) {
      Alert.alert('Límite alcanzado', `Puedes subir máximo ${maxImages} imágenes`);
      return;
    }

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setIsLoading(true);
    try {
      const result = await ExpoImagePicker.launchCameraAsync({
        mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newImages = [...images, result.assets[0].uri];
        onImagesChange(newImages);
      }
    } catch (error) {
      console.error('Error al tomar foto:', error);
      Alert.alert('Error', 'No se pudo tomar la foto');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectImages = async () => {
    if (images.length >= maxImages) {
      Alert.alert('Límite alcanzado', `Puedes subir máximo ${maxImages} imágenes`);
      return;
    }

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setIsLoading(true);
    try {
      const result = await ExpoImagePicker.launchImageLibraryAsync({
        mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: maxImages - images.length,
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        const newImages = [...images, ...result.assets.map(asset => asset.uri)];
        onImagesChange(newImages);
      }
    } catch (error) {
      console.error('Error al seleccionar imágenes:', error);
      Alert.alert('Error', 'No se pudieron seleccionar las imágenes');
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Imágenes (opcional)</Text>
      <Text style={styles.subtitle}>
        Puedes agregar hasta {maxImages} imágenes a tu reseña
      </Text>

      {/* Botones de acción */}
      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          onPress={handleTakePhoto}
          disabled={isLoading || images.length >= maxImages}
          style={styles.actionButton}
          icon="camera"
        >
          📸 Tomar foto
        </Button>
        
        <Button
          mode="outlined"
          onPress={handleSelectImages}
          disabled={isLoading || images.length >= maxImages}
          style={styles.actionButton}
          icon="image"
        >
          🖼️ Seleccionar
        </Button>
      </View>

      {/* Imágenes seleccionadas */}
      {images.length > 0 && (
        <View style={styles.imagesContainer}>
          <Text style={styles.imagesLabel}>
            Imágenes seleccionadas ({images.length}/{maxImages})
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.imagesList}>
              {images.map((image, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{ uri: image }} style={styles.image} />
                  <IconButton
                    icon="close"
                    size={16}
                    iconColor="#ffffff"
                    style={styles.removeButton}
                    onPress={() => removeImage(index)}
                  />
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
  },
  imagesContainer: {
    marginTop: 8,
  },
  imagesLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8,
  },
  imagesList: {
    flexDirection: 'row',
    gap: 8,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    borderRadius: 12,
    margin: 0,
  },
}); 