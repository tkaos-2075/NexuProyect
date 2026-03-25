import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, RefreshControl, StatusBar } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFavorites } from '@hooks/useFavorites';
import { Surface, Text as PaperText, IconButton } from 'react-native-paper';
import PlaceMainCard from '@components/PlaceDetails/PlaceMainCard';
import ReviewsSection from '@components/PlaceDetails/ReviewsSection';
import { getPlaceToEatById } from '@services/placesToEat/getPlaceToEatById';
import { getPlaceToFunById } from '@services/placesToFun/getPlaceToFunById';
import { getReviewsByPlaceId } from '@services/reviews/getReviewsByPlaceId';
import { createReview } from '@services/reviews/createReview';
import AssignLabelToPlace from '@components/labels/AssignLabelToPlace';
import { PlacesToEatResponseDto } from '@interfaces/placesToEat/PlacesToEatResponseDto';
import { PlacesToFunResponseDto } from '@interfaces/placesToFun/PlacesToFunResponseDto';
import { ReviewResponseDto } from '@interfaces/reviews/ReviewResponseDto';

interface RouteParams {
  placeType: 'eat' | 'fun';
  placeId: number;
}

export default function PlaceDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { placeType, placeId } = route.params as RouteParams;
  const { isFavorite, toggleFavorite, loading: favoritesLoading } = useFavorites();
  
  const [place, setPlace] = useState<PlacesToEatResponseDto | PlacesToFunResponseDto | null>(null);
  const [reviews, setReviews] = useState<ReviewResponseDto[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  useEffect(() => {
    async function fetchPlace() {
      setLoading(true);
      try {
        let res;
        if (placeType === 'eat') {
          res = await getPlaceToEatById(placeId);
        } else {
          res = await getPlaceToFunById(placeId);
        }
        setPlace(res.data);
      } catch (error) {
        console.error('Error al cargar el lugar:', error);
        setPlace(null);
      } finally {
        setLoading(false);
      }
    }
    fetchPlace();
  }, [placeId, placeType]);

  // Cargar reviews cuando el lugar esté disponible
  useEffect(() => {
    if (place) {
      loadReviews();
    }
  }, [place]);

  const loadReviews = async () => {
    setLoadingReviews(true);
    try {
      const res = await getReviewsByPlaceId(placeId);
      setReviews(res.data);
    } catch (error) {
      console.error('Error al cargar las reseñas:', error);
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadReviews();
    } catch (error) {
      console.error('Error al refrescar:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleShowOnMap = () => {
    if (place) {
      // @ts-ignore
      navigation.navigate('Home', { showPlaceOnMap: place });
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1e40af" />
            <PaperText style={[styles.loadingText, { color: '#64748b' }]}>
              Cargando lugar...
            </PaperText>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  if (!place) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <PaperText style={[styles.errorText, { color: '#dc2626' }]}>
              No se encontró el lugar
            </PaperText>
            <TouchableOpacity 
              style={[styles.retryButton, { backgroundColor: '#e5e7eb' }]}
              onPress={handleGoBack}
            >
              <PaperText style={[styles.retryButtonText, { color: '#374151' }]}>
                Volver
              </PaperText>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header con botón de regreso */}
        <Surface style={styles.header} elevation={1}>
          <IconButton
            icon="arrow-left"
            size={24}
            iconColor="#374151"
            onPress={handleGoBack}
            style={styles.backButton}
          />
          <PaperText 
            variant="titleMedium" 
            style={styles.headerTitle}
            numberOfLines={1}
          >
            {place.name}
          </PaperText>
          <View style={styles.headerSpacer} />
        </Surface>

        {/* Contenido principal */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#1e40af"
              colors={["#1e40af"]}
              progressBackgroundColor="#ffffff"
              title="Actualizando..."
              titleColor="#64748b"
            />
          }
        >
          {place && (
            <>
              <PlaceMainCard 
                place={place}
                onShowOnMap={handleShowOnMap}
              />
              <AssignLabelToPlace placeId={place.id} />
            </>
          )}
          
          <ReviewsSection
            reviews={reviews}
            placeId={placeId}
            onRefresh={loadReviews}
            refreshing={refreshing}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  backButton: {
    margin: 0,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    color: '#374151',
  },
  headerSpacer: {
    width: 48, // Mismo ancho que el botón para centrar el título
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
}); 