import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PlacesToEatResponseDto } from '@interfaces/placesToEat/PlacesToEatResponseDto';
import { PlacesToFunResponseDto } from '@interfaces/placesToFun/PlacesToFunResponseDto';
import PlaceCard from '@components/places/PlaceCard';

interface ProfileFavoritesProps {
  favEat: PlacesToEatResponseDto[];
  favFun: PlacesToFunResponseDto[];
  loadingFavorites?: boolean;
}

const ProfileFavorites: React.FC<ProfileFavoritesProps> = ({ favEat, favFun, loadingFavorites }) => (
  <View style={styles.card}>
    <Text style={styles.title}>Favoritos</Text>
    {loadingFavorites ? (
      <Text style={styles.text}>Cargando favoritos...</Text>
    ) : (
      <>
        <Text style={styles.subtitle}>Para Comer</Text>
        {favEat.length === 0 ? (
          <Text style={styles.text}>No tienes lugares favoritos para comer.</Text>
        ) : (
          <View style={styles.listContent}>
            {favEat.map(place => (
              <PlaceCard key={place.id.toString()} place={place} />
            ))}
          </View>
        )}
        <Text style={styles.subtitle}>Para Divertirse</Text>
        {favFun.length === 0 ? (
          <Text style={styles.text}>No tienes lugares favoritos para divertirte.</Text>
        ) : (
          <View style={styles.listContent}>
            {favFun.map(place => (
              <PlaceCard key={place.id.toString()} place={place} />
            ))}
          </View>
        )}
      </>
    )}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 18,
    padding: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginTop: 10,
    marginBottom: 6,
  },
  text: {
    color: '#64748b',
    fontSize: 15,
    marginBottom: 8,
  },
  listContent: {
    gap: 8,
    marginBottom: 8,
  },
});

export default ProfileFavorites; 