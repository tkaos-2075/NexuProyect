import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthContext } from '@contexts/AuthContext';
import LoginForm from '@components/LoginForm';
import KeyboardAwareScrollView from '@components/KeyboardAwareScrollView';
import { ActivityIndicator } from 'react-native-paper';
import { useTheme } from '@contexts/ThemeContext';

export default function LoginScreen() {
  const { login, isLoading } = useAuthContext();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const colors = {
    background: '#e3f0ff',
    button: '#38b6ff', // celeste claro
    buttonText: '#fff',
    link: '#1976d2',
    inputBg: '#fff',
    inputText: '#0a2342',
  };

  const handleLogin = async (email: string, password: string) => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      await login({ email, password });
      console.log('Login exitoso');
    } catch (error) {
      console.error('Error en login:', error);
      Alert.alert(
        'Error de Login',
        'Credenciales incorrectas. Verifica tu email y contraseña.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegisterPress = () => {
    navigation.navigate('Register' as never);
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
        <LoginForm 
          onSubmit={handleLogin}
          isLoading={isLoggingIn}
          inputBg={colors.inputBg}
          inputText={colors.inputText}
          buttonColor={colors.button}
          buttonTextColor={colors.buttonText}
        />
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>¿No tienes una cuenta?</Text>
        <Text style={[styles.registerLink, { color: colors.link }]} onPress={handleRegisterPress}>
          Regístrate aquí
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
  registerLink: {
    fontSize: 14,
    fontWeight: '600',
  },
}); 