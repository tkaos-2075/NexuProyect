import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthContext } from '@contexts/AuthContext';
import { useAuth } from '@hooks/useAuth';
import { useTheme } from '@contexts/ThemeContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function WelcomeScreen() {
  const navigation = useNavigation();
  const { session, isLoading: authIsLoading } = useAuthContext();
  const { loginAsViewer, isLoading, error } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [currentFeature, setCurrentFeature] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  // Paleta de colores según tema
  const colors = {
    background: theme === 'dark' ? '#0a2342' : '#e3f0ff',
    mapButton: theme === 'dark' ? '#38b6ff' : '#1976d2',
    mapButtonText: theme === 'dark' ? '#111' : '#fff', // negro en oscuro, blanco en claro
    primaryButton: theme === 'dark' ? '#1976d2' : '#38b6ff',
    primaryButtonText: theme === 'dark' ? '#111' : '#fff', // negro en oscuro, blanco en claro
    secondaryButtonBorder: theme === 'dark' ? '#38b6ff' : '#1976d2',
    secondaryButtonText: theme === 'dark' ? '#fff' : '#1976d2', // blanco en oscuro SOLO para este botón
    carouselCard: theme === 'dark' ? '#123a6d' : '#ffffff',
    carouselCardBorder: theme === 'dark' ? '#38b6ff' : '#e5e7eb',
  };

  const features = [
    {
      title: 'Exploración sin registro',
      description: 'Consulta lugares disponibles sin necesidad de registrarte',
      icon: '🔍',
    },
    {
      title: 'Planes colaborativos',
      description: 'Crea planes personales, públicos o grupales para organizar visitas',
      icon: '📅',
    },
    {
      title: 'Mapa interactivo',
      description: 'Visualiza los lugares en un mapa dinámico con Google Maps',
      icon: '🗺️',
    },
    {
      title: 'Comentarios y fotos',
      description: 'Deja opiniones y sube imágenes de los lugares que visitas',
      icon: '📸',
    },
    {
      title: 'Etiquetas personalizadas',
      description: 'Encuentra lugares según tus intereses: económico, pet-friendly, etc.',
      icon: '🏷️',
    },
  ];

  // Carrusel automático
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => {
        const next = (prev + 1) % features.length;
        scrollRef.current?.scrollTo({ x: next * (screenWidth * 0.8 + 16), animated: true });
        return next;
      });
    }, 3500);
    return () => clearInterval(interval);
  }, [features.length]);

  useEffect(() => {
    if (session && !authIsLoading) {
      // Navegar a la pantalla principal (Home) si ya hay sesión
      navigation.reset({ index: 0, routes: [{ name: 'Main' as never }] });
    }
  }, [session, authIsLoading, navigation]);

  useEffect(() => {
    if (error) {
      // Aquí podrías mostrar un Toast o similar
      console.error('Error al acceder como viewer:', error);
    }
  }, [error]);

  const handleLoginPress = () => {
    navigation.navigate('Login' as never);
  };

  const handleRegisterPress = () => {
    navigation.navigate('Register' as never);
  };

  const handleMapAccess = async () => {
    try {
      await loginAsViewer();
    } catch (err) {
      console.error('Error al acceder al mapa:', err);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f8fafc' }]}>
        <Text style={[styles.loadingText, { color: theme === 'dark' ? '#a1a1aa' : '#64748b' }]}>
          Cargando...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        {/* Imagen principal más grande */}
        <Image
          source={
            theme === 'dark' 
              ? require('../../assets/home.png') 
              : require('../../assets/home_dark.png')
          }
          style={styles.welcomeImageLarge}
          resizeMode="contain"
        />
      </View>

      {/* Botones de acción inmediatamente después de la imagen */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={[styles.mapButton, { backgroundColor: colors.mapButton }]} onPress={handleMapAccess}>
          <Text style={styles.mapButtonIcon}>🗺️</Text>
          <Text style={[styles.mapButtonText, { color: colors.mapButtonText }]}>Entrar al Mapa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.primaryButton, { backgroundColor: colors.primaryButton }]} onPress={handleRegisterPress}>
          <Text style={[styles.primaryButtonText, { color: colors.primaryButtonText }]}>Crear Cuenta</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.secondaryButton, { borderColor: colors.secondaryButtonBorder }]} onPress={handleLoginPress}>
          <Text style={[styles.secondaryButtonText, { color: colors.secondaryButtonText }]}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>

      {/* Carrusel después de los botones */}
      <View style={styles.mainContent}>
        {/* Carrusel de características */}
        <View style={styles.carouselWrapper}>
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.carousel}
            contentContainerStyle={{
              alignItems: 'center',
              paddingHorizontal: screenWidth * 0.1, // 10% a cada lado
            }}
            snapToInterval={screenWidth * 0.8 + 16} // ancho tarjeta + gap
            decelerationRate="fast"
            onMomentumScrollEnd={e => {
              const index = Math.round(e.nativeEvent.contentOffset.x / (screenWidth * 0.8 + 16));
              setCurrentFeature(index);
            }}
          >
            {features.map((feature, idx) => (
              <View key={idx} style={[styles.featureItem, {
                width: screenWidth * 0.8,
                marginRight: idx !== features.length - 1 ? 16 : 0, // separación entre tarjetas
                backgroundColor: colors.carouselCard,
                borderColor: colors.carouselCardBorder,
                shadowColor: theme === 'dark' ? '#000' : '#1e293b',
                shadowOpacity: 0.15,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 4 },
                elevation: 4,
                justifyContent: 'center',
                alignItems: 'center',
              }]}> 
                <Text style={styles.featureIcon}>{feature.icon}</Text>
                <Text style={[styles.featureTitle, { color: theme === 'dark' ? '#ffffff' : '#1e293b' }]}>{feature.title}</Text>
                <Text style={[styles.featureDescription, { color: theme === 'dark' ? '#a1a1aa' : '#64748b' }]}>{feature.description}</Text>
              </View>
            ))}
          </ScrollView>
          {/* Indicadores del carrusel */}
          <View style={styles.carouselIndicators}>
            {features.map((_, idx) => (
              <View
                key={idx}
                style={[styles.carouselDot, currentFeature === idx && { backgroundColor: theme === 'dark' ? '#fff' : '#1e40af', width: 18 }]}
              />
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    // padding: 20, // Elimina el padding global
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    alignItems: 'center',
    marginTop: 32, // Nuevo margen superior para bajar el bloque
  },
  welcomeImage: {
    width: '100%',
    height: 180,
    marginBottom: 16,
    borderRadius: 16,
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 18,
    textAlign: 'center',
  },
  mainContent: {
    // marginBottom: 40, // Elimina el marginBottom
    paddingHorizontal: 20, // Aplica padding solo aquí
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  carouselWrapper: {
    alignItems: 'center',
    marginBottom: 24,
    // paddingHorizontal: 0, // Asegura que no haya padding extra
  },
  carousel: {
    width: '100%',
    flexGrow: 0,
  },
  featureItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 8,
    minHeight: 220,
    height: Math.max(0.22 * screenHeight, 180), // Altura responsiva
    flex: 1,
  },
  featureIcon: {
    fontSize: 38,
    marginBottom: 14,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 20,
  },
  carouselIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    gap: 8,
  },
  carouselDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#cbd5e1',
    marginHorizontal: 2,
  },
  actionsContainer: {
    gap: 14,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 24,
  },
  mapButton: {
    width: '75%',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 6,
    shadowColor: '#1976d2',
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  mapButtonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  mapButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButton: {
    width: '75%',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    marginBottom: 6,
    shadowColor: '#38b6ff',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    width: '75%',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    borderWidth: 2,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  welcomeImageLarge: {
    width: screenWidth * 0.8,
    height: screenHeight * 0.28,
    marginTop: 0,
    marginBottom: 20,
    alignSelf: 'center',
    borderRadius: 24,
  },
  themeToggleButton: {
    backgroundColor: '#1e40af',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 8,
  },
  themeToggleButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  themeToggleFab: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  themeToggleFabLight: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  themeToggleFabDark: {
    backgroundColor: '#23272f',
    borderWidth: 1,
    borderColor: '#404040',
  },
  themeToggleFabIcon: {
    fontSize: 26,
  },
}); 