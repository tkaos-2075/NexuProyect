import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import HomeScreen from '@screens/HomeScreen';
import ProfileScreen from '@screens/ProfileScreen';
import LabelsScreen from '@screens/LabelsScreen';
import PlacesScreen from '@screens/PlacesScreen';
import PlanScreen from '@screens/PlanScreen';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import ThemeToggle from '../components/ThemeToggle';
import { useAuthContext } from '@contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: any) {
  const { logout } = useAuthContext();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1, backgroundColor: isDark ? '#0a2342' : '#e3f0ff', paddingTop: 0 }}>
      <View style={styles.headerContainer}>
        {/* Logo centrado */}
        <Image 
          source={require('../../assets/logo-nexu.png')} 
          style={styles.logoImage} 
        />
        {/* Botón de cerrar Drawer en la esquina superior derecha */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => props.navigation.closeDrawer()}
          activeOpacity={0.8}
        >
          <Text style={[styles.closeButtonIcon, { color: isDark ? '#fff' : '#232946' }]}>✕</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, marginTop: 8 }}>
        <DrawerItemList {...props} />
      </View>
      {/* Botón personalizado para cerrar sesión */}
      <View style={{ alignItems: 'center', marginTop: 24, marginBottom: 16 }}>
        <TouchableOpacity
          onPress={logout}
          style={{
            borderColor: isDark ? '#38bdf8' : '#0ea5e9',
            borderWidth: 2,
            borderRadius: 9999,
            paddingVertical: 10,
            paddingHorizontal: 32,
            backgroundColor: 'transparent',
            minWidth: 180,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: '#ef4444', fontWeight: 'bold', fontSize: 16 }}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

export default function DrawerNavigator() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: isDark ? '#0a2342' : '#e3f0ff',
        },
        headerStyle: {
          backgroundColor: isDark ? '#0a2342' : '#e3f0ff',
        },
        headerTintColor: isDark ? '#fff' : '#232946',
        drawerActiveTintColor: isDark ? '#38bdf8' : '#1976d2',
        drawerInactiveTintColor: isDark ? '#e5e7eb' : '#232946',
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
      <Drawer.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
      <Drawer.Screen name="Labels" component={LabelsScreen} options={{ title: 'Etiquetas' }} />
      <Drawer.Screen name="Places" component={PlacesScreen} options={{ title: 'Lugares' }} />
      <Drawer.Screen name="Plan" component={PlanScreen} options={{ title: 'Planes' }} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 24,
    paddingBottom: 8,
    position: 'relative',
  },
  logoImage: {
    width: 120,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  themeToggleWrapper: {
    alignItems: 'center',
    marginBottom: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.08)',
    zIndex: 10,
  },
  closeButtonIcon: {
    fontSize: 20,
    fontWeight: 'bold',
  },
}); 