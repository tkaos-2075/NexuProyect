import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import ProfileEditForm from '@components/profile/ProfileEditForm';
import ProfilePlans from '@components/profile/ProfilePlans';
import ProfileFavorites from '@components/profile/ProfileFavorites';
import SimpleToast from '../components/SimpleToast';
import { useAuthContext } from '@contexts/AuthContext';
import { getCurrentUser } from '@services/users/currentUser';
import { UsersResponseDto } from '@interfaces/user/UsersResponseDto';
import { PlansResponseDto } from '@interfaces/plans/PlansResponseDto';
import { PlacesToEatResponseDto } from '@interfaces/placesToEat/PlacesToEatResponseDto';
import { PlacesToFunResponseDto } from '@interfaces/placesToFun/PlacesToFunResponseDto';
import { getPlansByUserId } from '@services/plans/getPlansByUserId';
import { getFavoritesPlacesToEatByUser } from '@services/placesToEat/getFavoritesPlacesToEatByUser';
import { getFavoritesPlacesToFunByUser } from '@services/placesToFun/getFavoritesPlacesToFunByUser';
import { updateUser } from '@services/users/updateUser';
import { deleteUser } from '@services/users/deleteUser';
import { useNavigation } from '@react-navigation/native';
import { useRoleCheck } from '@hooks/useRoleCheck';
import { Button } from 'react-native-paper';

export default function ProfileScreen() {
  const { logout, login, session, isLoading } = useAuthContext();
  const navigation = useNavigation();
  const { isAdmin } = useRoleCheck();
  const [user, setUser] = useState<UsersResponseDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [plans, setPlans] = useState<PlansResponseDto[]>([]);
  const [favEat, setFavEat] = useState<PlacesToEatResponseDto[]>([]);
  const [favFun, setFavFun] = useState<PlacesToFunResponseDto[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' as 'success' | 'error' });
  const [editForm, setEditForm] = useState({ name: '', email: '', password: '', newPassword: '' });
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    if (!isLoading && !session) {
      navigation.reset({ index: 0, routes: [{ name: 'Welcome' as never }] });
    }
  }, [session, isLoading, navigation]);

  useEffect(() => {
    if (session && !isLoading) {
      loadUserData();
    }
  }, [session, isLoading]);

  const loadUserData = async () => {
    setIsLoadingUser(true);
    try {
      console.log('Cargando datos del usuario...');
      const response = await getCurrentUser();
      const userData = response.data;
      console.log('Datos del usuario cargados:', userData);
      setUser(userData);
      setEditForm({
        name: userData.name,
        email: userData.email,
        password: '',
        newPassword: ''
      });
      await Promise.all([
        fetchPlans(userData.id),
        fetchFavorites(userData.id)
      ]);
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
      Alert.alert(
        'Error',
        'No se pudieron cargar los datos del usuario. Verifica tu conexión a internet.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoadingUser(false);
    }
  };

  const fetchPlans = async (userId: number) => {
    try {
      const plansRes = await getPlansByUserId(userId);
      setPlans(plansRes.data || []);
    } catch (err) {}
  };

  const fetchFavorites = async (userId: number) => {
    try {
      setLoadingFavorites(true);
      const [favEatRes, favFunRes] = await Promise.all([
        getFavoritesPlacesToEatByUser(userId),
        getFavoritesPlacesToFunByUser(userId)
      ]);
      setFavEat(favEatRes.data || []);
      setFavFun(favFunRes.data || []);
    } catch (err) {} finally {
      setLoadingFavorites(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      // Preparar datos para actualizar
      const updateData: { name: string; email: string; password?: string } = {
        name: editForm.name.trim() || user.name,
        email: editForm.email.trim() || user.email,
      };
      
      // Solo incluir contraseña si se ingresó una nueva
      if (editForm.newPassword.trim()) {
        updateData.password = editForm.newPassword.trim();
      }
      
      // Verificar si hay cambios reales
      const hasChanges = 
        updateData.name !== user.name || 
        updateData.email !== user.email || 
        updateData.password;
      
      if (hasChanges) {
        await updateUser(user.id, updateData);
        
        // Login automático si cambió email o contraseña
        if (updateData.email !== user.email || updateData.password) {
          try {
            await login({
              email: updateData.email,
              password: updateData.password || editForm.password,
            });
            setToast({ message: 'Perfil actualizado correctamente', type: 'success' });
          } catch (e) {
            setToast({ message: 'Perfil actualizado, pero hubo un problema al iniciar sesión automáticamente. Por favor, vuelve a iniciar sesión.', type: 'error' });
          }
        } else {
          setToast({ message: 'Perfil actualizado correctamente', type: 'success' });
        }
      } else {
        setToast({ message: 'No hay cambios para guardar', type: 'success' });
      }
      
      setShowEditForm(false);
      await loadUserData();
    } catch (err) {
      setToast({ message: 'Error al actualizar el perfil', type: 'error' });
    }
  };
  const handleCancel = () => setShowEditForm(false);
  const handleDeleteAccount = async () => {
    if (!user) return;
    
    Alert.alert(
      'Eliminar Cuenta',
      '¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteUser(user.id);
              setToast({ message: 'Cuenta eliminada correctamente', type: 'success' });
              setTimeout(() => {
                logout();
              }, 1200);
            } catch (err) {
              setToast({ message: 'Error al eliminar la cuenta', type: 'error' });
            }
          },
        },
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadUserData();
    } catch (error) {
      console.error('Error durante el refresh:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigation.reset({ index: 0, routes: [{ name: 'Welcome' as never }] });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (isLoading || !session) return null;

  if (isLoadingUser) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e40af" />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadUserData}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mi Perfil</Text>
        <Text style={styles.subtitle}>
          Gestiona tu información personal
        </Text>
      </View>

      <ScrollView
        style={styles.profileContainer}
        contentContainerStyle={styles.profileContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#1e40af"
            title="Actualizando perfil..."
            titleColor="#64748b"
          />
        }
      >
        {user ? (
          <View style={styles.profileSection}>
            <View style={styles.userCard}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name || 'Usuario'}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <Text style={styles.userRole}>
                  Rol: {user.role || 'Usuario'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setShowEditForm(true)}
              >
                <Text style={styles.editButtonText}>Editar</Text>
              </TouchableOpacity>
            </View>

            {showEditForm && (
              <ProfileEditForm
                editForm={editForm}
                setEditForm={setEditForm}
                onSave={handleSave}
                onCancel={handleCancel}
                loading={false}
              />
            )}

            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Información</Text>
              
              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>ID de Usuario</Text>
                <Text style={styles.infoValue}>{user.id}</Text>
              </View>
            </View>

            {/* Componente de Favoritos */}
            <ProfileFavorites 
              favEat={favEat}
              favFun={favFun}
              loadingFavorites={loadingFavorites}
            />

            {/* Componente de Planes */}
            <ProfilePlans plans={plans} />
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No se pudieron cargar los datos del usuario
            </Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={loadUserData}
            >
              <Text style={styles.retryButtonText}>
                Reintentar
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <View style={styles.actionsContainer}>
        <Button
          mode="outlined"
          onPress={handleLogout}
          style={styles.logoutButton}
          textColor="#dc2626"
        >
          Cerrar Sesión
        </Button>
        
        <Button
          mode="outlined"
          onPress={handleDeleteAccount}
          style={styles.deleteButton}
          textColor="#dc2626"
        >
          Eliminar Cuenta
        </Button>
      </View>
      {toast.message && (
        <SimpleToast message={toast.message} type={toast.type} onHide={() => setToast({ ...toast, message: '' })} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
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
  profileContainer: {
    flex: 1,
  },
  profileContent: {
    padding: 16,
    paddingBottom: 20,
  },
  profileSection: {
    gap: 20,
  },
  userCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1e40af',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '500',
  },
  editButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  infoSection: {
    gap: 12,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  infoLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  actionsContainer: {
    marginTop: 30,
    gap: 12,
  },
  logoutButton: {
    borderColor: '#dc2626',
  },
  deleteButton: {
    borderColor: '#dc2626',
  },
}); 