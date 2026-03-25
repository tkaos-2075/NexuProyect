import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Modal, ScrollView, Dimensions, Text } from 'react-native';
import { IconButton } from 'react-native-paper';

interface ReviewImageGalleryProps {
  images: string[];
  maxPreviewImages?: number;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function ReviewImageGallery({ images, maxPreviewImages = 3 }: ReviewImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  const previewImages = images.slice(0, maxPreviewImages);
  const remainingCount = images.length - maxPreviewImages;

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeImageModal = () => {
    setSelectedImageIndex(null);
  };

  const nextImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex < images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const previousImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imagesList}>
        {previewImages.map((imageUrl, index) => (
          <TouchableOpacity
            key={index}
            style={styles.imageContainer}
            onPress={() => openImageModal(index)}
            activeOpacity={0.8}
          >
            <Image 
              source={{ uri: imageUrl }} 
              style={styles.reviewImage}
              resizeMode="cover"
            />
            {index === maxPreviewImages - 1 && remainingCount > 0 && (
              <View style={styles.overlay}>
                <View style={styles.remainingCount}>
                  <IconButton
                    icon="plus"
                    size={16}
                    iconColor="#ffffff"
                    style={styles.plusIcon}
                  />
                  <Text style={styles.remainingText}>+{remainingCount}</Text>
                </View>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Modal para vista ampliada */}
      <Modal
        visible={selectedImageIndex !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={closeImageModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Header con botón de cerrar */}
            <View style={styles.modalHeader}>
              <IconButton
                icon="close"
                size={24}
                iconColor="#ffffff"
                onPress={closeImageModal}
                style={styles.closeButton}
              />
              {images.length > 1 && (
                <View style={styles.imageCounter}>
                  <Text style={styles.counterText}>
                    {selectedImageIndex! + 1} / {images.length}
                  </Text>
                </View>
              )}
            </View>

            {/* Imagen principal */}
            <ScrollView 
              horizontal 
              pagingEnabled 
              showsHorizontalScrollIndicator={false}
              style={styles.imageScrollView}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
                setSelectedImageIndex(index);
              }}
            >
              {images.map((imageUrl, index) => (
                <View key={index} style={styles.fullImageContainer}>
                  <Image 
                    source={{ uri: imageUrl }} 
                    style={styles.fullImage}
                    resizeMode="contain"
                  />
                </View>
              ))}
            </ScrollView>

            {/* Botones de navegación */}
            {images.length > 1 && (
              <>
                <TouchableOpacity
                  style={[styles.navButton, styles.prevButton]}
                  onPress={previousImage}
                  disabled={selectedImageIndex === 0}
                >
                  <IconButton
                    icon="chevron-left"
                    size={24}
                    iconColor="#ffffff"
                  />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.navButton, styles.nextButton]}
                  onPress={nextImage}
                  disabled={selectedImageIndex === images.length - 1}
                >
                  <IconButton
                    icon="chevron-right"
                    size={24}
                    iconColor="#ffffff"
                  />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  imagesList: {
    flexDirection: 'row',
    gap: 8,
  },
  imageContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  reviewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  remainingCount: {
    alignItems: 'center',
  },
  plusIcon: {
    margin: 0,
  },
  remainingText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  modalHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  closeButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
  imageCounter: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  counterText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  imageScrollView: {
    flex: 1,
  },
  fullImageContainer: {
    width: screenWidth,
    height: screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: screenWidth,
    height: screenHeight * 0.8,
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -20 }],
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  prevButton: {
    left: 16,
  },
  nextButton: {
    right: 16,
  },
}); 