import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthContext } from '@contexts/AuthContext';
import RegisterForm from '@components/RegisterForm';
import KeyboardAwareScrollView from '@components/KeyboardAwareScrollView';
import { ActivityIndicator } from 'react-native-paper';
import { useTheme } from '@contexts/ThemeContext';

export default function RegisterScreen() {
  const { register, isLoading } = useAuthContext();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [isRegistering, setIsRegistering] = useState(false);

  const colors = {
    background: '#e3f0ff',
    button: '#38b6ff', // celeste claro
    buttonText: '#fff',
    link: '#1976d2',
    inputBg: '#fff',
    inputText: '#0a2342',
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    if (isRegistering) return;
    setIsRegistering(true);
    try {
      await register({ name, email, password });
      console.log('Registro exitoso');
    } catch (error) {
      console.error('Error en registro:', error);
      Alert.alert(
        'Error de Registro',
        'No se pudo crear la cuenta. Verifica tus datos e intenta de nuevo.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsRegistering(false);
    }
  };

  const handleLoginPress = () => {
    navigation.navigate('Login' as never);
  };

  const handleBack = () => {
    navigation.navigate('Welcome' as never);
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}> 
        <ActivityIndicator size="large" color={colors.button} />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Botón de retroceso */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backButtonIcon}>←</Text>
      </TouchableOpacity>
      {/* Logo */}
      <Image source={require('../../assets/logo-nexu.png')} style={styles.logo} resizeMode="contain" />
      <View style={styles.formContainer}>
        <RegisterForm 
          onSubmit={handleRegister}
          isLoading={isRegistering}
          inputBg={colors.inputBg}
          inputText={colors.inputText}
          buttonColor={colors.button}
          buttonTextColor={colors.buttonText}
        />
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>¿Ya tienes una cuenta?</Text>
        <Text style={[styles.loginLink, { color: colors.link }]} onPress={handleLoginPress}>
          Inicia sesión aquí
        </Text>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
    color: '#64748b',
  },
  backButton: {
    position: 'absolute',
    top: 32,
    left: 16,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonIcon: {
    fontSize: 22,
    color: '#1976d2',
    fontWeight: 'bold',
  },
  logo: {
    width: 160,
    height: 90,
    alignSelf: 'center',
  },
  formContainer: {
    width: '100%',
    marginBottom: 30,
  },
  footer: {
    alignItems: 'center',
    marginTop: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
  },
}); 