import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, RefreshControl, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthState } from "@hooks/useAuth";
import { getAllPlacesToEat } from '@services/placesToEat/getAllPlacesToEat';
import { getAllPlacesToFun } from '@services/placesToFun/getAllPlacesToFun';
import { PlacesToEatResponseDto } from '@interfaces/placesToEat/PlacesToEatResponseDto';
import { PlacesToFunResponseDto } from '@interfaces/placesToFun/PlacesToFunResponseDto';
import UnifiedView from '../components/places/UnifiedView';
import { ActivityIndicator } from 'react-native-paper';

export default function PlacesScreen() {
  const { session, isLoading } = useAuthState();
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  
  const [placesEat, setPlacesEat] = useState<PlacesToEatResponseDto[]>([]);
  const [placesFun, setPlacesFun] = useState<PlacesToFunResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!isLoading && !session) {
      navigation.reset({ index: 0, routes: [{ name: 'Welcome' as never }] });
    }
  }, [session, isLoading, navigation]);

  useEffect(() => {
    async function fetchPlaces() {
      setLoading(true);
      setError('');
      try {
        const [eatRes, funRes] = await Promise.all([
          getAllPlacesToEat(),
          getAllPlacesToFun()
        ]);
        
        // Filtrar lugares válidos
        const validPlacesEat = (eatRes.data || []).filter(place => place && place.id && place.name);
        const validPlacesFun = (funRes.data || []).filter(place => place && place.id && place.name);
        
        setPlacesEat(validPlacesEat);
        setPlacesFun(validPlacesFun);
      } catch {
        setError('Error al cargar los lugares');
      } finally {
        setLoading(false);
      }
    }
    fetchPlaces();
  }, []);

  const allPlaces = [...placesEat, ...placesFun];

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const [eatRes, funRes] = await Promise.all([
        getAllPlacesToEat(),
        getAllPlacesToFun()
      ]);
      
      // Filtrar lugares válidos
      const validPlacesEat = (eatRes.data || []).filter(place => place && place.id && place.name);
      const validPlacesFun = (funRes.data || []).filter(place => place && place.id && place.name);
      
      setPlacesEat(validPlacesEat);
      setPlacesFun(validPlacesFun);
    } catch (error) {
      console.error('Error durante el refresh:', error);
    } finally {
      setRefreshing(false);
    }
  };

  if (isLoading || !session) return null;

  const handleShowOnMap = (place: PlacesToEatResponseDto | PlacesToFunResponseDto) => {
    console.log('Mostrar en mapa:', place.name);
  };

  return (
    <View style={[styles.container, isMobile && styles.containerMobile]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Lugares</Text>
        <Text style={styles.subtitle}>
          Descubre los mejores lugares para comer y divertirte
        </Text>
      </View>

      {/* Contenido principal */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1e40af" />
          <Text style={styles.loadingText}>
            Cargando lugares...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setLoading(true);
              setError('');
              // Recargar lugares
            }}
          >
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <UnifiedView
          onShowOnMap={handleShowOnMap}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#1e40af"
              title="Actualizando lugares..."
              titleColor="#64748b"
            />
          }
        />
      )}
      
      {/* Botón flotante para agregar lugar */}
      <TouchableOpacity
        style={[styles.fab, isMobile && styles.fabMobile]}
        onPress={() => navigation.navigate('AddPlace' as never)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  containerMobile: {
    // Estilos específicos para móvil si es necesario
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
    color: '#64748b',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#1e40af',
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1e40af',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabMobile: {
    bottom: 16,
    right: 16,
  },
  fabText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
}); 