import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AddPlaceForm from '@components/places/AddPlaceForm';
import { useFocusEffect } from '@react-navigation/native';

interface AddPlaceScreenParams {
  lat?: number;
  lng?: number;
}

export default function AddPlaceScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const params = route.params as AddPlaceScreenParams;

  const handleClose = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handlePlaceCreated = () => {
    // El mapa se actualizará automáticamente cuando regresemos
    console.log('Lugar creado, actualizando mapa...');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AddPlaceForm
        onClose={handleClose}
        lat={params?.lat}
        lng={params?.lng}
        onPlaceCreated={handlePlaceCreated}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
}); 