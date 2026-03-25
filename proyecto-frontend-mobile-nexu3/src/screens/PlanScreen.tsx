import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert, RefreshControl } from 'react-native';
import { useAuthContext } from '@contexts/AuthContext';
import { getPlansByUserId } from '@services/plans/getPlansByUserId';
import { PlansResponseDto } from '@interfaces/plans/PlansResponseDto';
import { PlacesToEatResponseDto } from '@interfaces/placesToEat/PlacesToEatResponseDto';
import { PlacesToFunResponseDto } from '@interfaces/placesToFun/PlacesToFunResponseDto';
import { getAllPlacesToEat } from '@services/placesToEat/getAllPlacesToEat';
import { getAllPlacesToFun } from '@services/placesToFun/getAllPlacesToFun';
import ProfilePlans from '@components/profile/ProfilePlans';
import CreatePlanForm from '@components/plans/CreatePlanForm';
import SimpleToast from '@components/SimpleToast';
import { getCurrentUser } from '@services/users/currentUser';
import { useNavigation } from '@react-navigation/native';
import { getAllPlans } from '@services/plans/getAllPlans';
import { ActivityIndicator } from 'react-native-paper';
import { Button } from 'react-native-paper';
import { deletePlan } from '@services/plans/deletePlan';
import { createPlan } from '@services/plans/createPlan';
import PlanCard from '@components/plans/PlanCard';

export default function PlanScreen() {
  const { session, isLoading } = useAuthContext();
  const navigation = useNavigation();
  
  const [plans, setPlans] = useState<PlansResponseDto[]>([]);
  const [places, setPlaces] = useState<(PlacesToEatResponseDto | PlacesToFunResponseDto)[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info' | 'warning'>('info');
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Obtener el usuario actual y su ID
  const fetchCurrentUser = async () => {
    if (!session) return;
    try {
      const res = await getCurrentUser();
      if (res && res.data && res.data.id) {
        setUserId(res.data.id);
      } else {
        throw new Error('No se pudo obtener el usuario actual');
      }
    } catch (err) {
      setError('Error al obtener el usuario actual');
      showToastMessage('Error al obtener el usuario actual', 'error');
    }
  };

  // Cargar planes del usuario
  const fetchPlans = async (uid?: number | null) => {
    if (!session) return;
    setLoading(true);
    setError(null);
    try {
      const idToUse = typeof uid === 'number' ? uid : userId;
      if (!idToUse) {
        throw new Error('No se pudo obtener el ID del usuario');
      }
      const res = await getPlansByUserId(idToUse);
      setPlans(res.data || []);
    } catch (err) {
      setError('Error al cargar los planes');
      showToastMessage('Error al cargar los planes', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Cargar lugares disponibles
  const fetchPlaces = async () => {
    setLoadingPlaces(true);
    try {
      const [placesToEatRes, placesToFunRes] = await Promise.all([
        getAllPlacesToEat(),
        getAllPlacesToFun()
      ]);
      
      const allPlaces = [
        ...(placesToEatRes.data || []),
        ...(placesToFunRes.data || [])
      ];
      
      setPlaces(allPlaces);
    } catch (err) {
      console.error('Error al cargar lugares:', err);
      showToastMessage('Error al cargar lugares disponibles', 'error');
    } finally {
      setLoadingPlaces(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchPlaces();
  }, [session]);

  // Cuando se obtiene el userId, cargar los planes
  useEffect(() => {
    if (userId) {
      fetchPlans(userId);
    }
  }, [userId]);

  // Redirigir si no hay sesión activa
  useEffect(() => {
    if (!isLoading && !session) {
      navigation.reset({ index: 0, routes: [{ name: 'Welcome' as never }] });
    }
  }, [session, isLoading, navigation]);

  // Cargar planes al montar el componente
  useEffect(() => {
    if (session && !isLoading) {
      loadPlans();
    }
  }, [session, isLoading]);

  const showToastMessage = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const handlePlanCreated = () => {
    if (userId) {
      fetchPlans(userId); // Recargar planes
    }
    setShowCreateForm(false);
    // Mostrar toast de éxito después de que se cierre el formulario
    setTimeout(() => {
      showToastMessage('¡Plan creado exitosamente!', 'success');
    }, 600);
  };

  const handleCreatePlan = async (name: string, description: string) => {
    // Esta función ya no se usa directamente, el CreatePlanForm maneja el servicio
    console.log('Plan creado:', { name, description });
  };

  const handleCloseCreateForm = () => {
    setShowCreateForm(false);
  };

  const loadPlans = async () => {
    if (!userId) {
      console.log('No hay userId disponible');
      return;
    }
    
    setIsLoadingPlans(true);
    try {
      console.log('Cargando planes para usuario:', userId);
      const response = await getPlansByUserId(userId);
      const plansData = response.data || [];
      console.log(`Planes cargados: ${plansData.length}`);
      setPlans(plansData);
    } catch (error) {
      console.error('Error al cargar planes:', error);
      Alert.alert(
        'Error',
        'No se pudieron cargar los planes. Verifica tu conexión a internet.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoadingPlans(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      if (userId) {
        await fetchPlans(userId);
      }
    } catch (error) {
      console.error('Error al refrescar:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeletePlan = async (planId: number) => {
    try {
      await deletePlan(planId);
      if (userId) {
        await fetchPlans(userId);
      }
    } catch (error) {
      console.error('Error al eliminar plan:', error);
    }
  };



  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando planes...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#1e40af"
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            Mis Planes
          </Text>
          <Button
            mode="contained"
            onPress={() => setShowCreateForm(true)}
            style={styles.createButton}
          >
            + Crear
          </Button>
        </View>

        {/* Lista de planes */}
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            onPress={() => {
              // Aquí puedes agregar navegación a detalles del plan
              console.log('Plan seleccionado:', plan.id);
            }}
          />
        ))}

        {/* Estado vacío */}
        {!loading && !error && plans.length === 0 && (
          <View style={styles.centerContainer}>
            <Text style={styles.emoji}>
              📅
            </Text>
            <Text style={styles.centerTitle}>
              No tienes planes aún
            </Text>
            <Text style={styles.centerText}>
              Crea tu primer plan para organizar mejor tu tiempo
            </Text>
            <TouchableOpacity 
              style={styles.createFirstButton}
              onPress={() => setShowCreateForm(true)}
            >
              <Text style={styles.createFirstButtonText}>
                ✨ Crear mi primer plan
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Toast de notificaciones */}
      {showToast && (
        <SimpleToast
          message={toastMessage}
          type={toastType}
          onHide={() => setShowToast(false)}
          duration={3000}
        />
      )}

      {showCreateForm && (
        <CreatePlanForm
          onSubmit={handleCreatePlan}
          isLoading={isSubmitting}
          submitText="Crear Plan"
          places={places}
          onClose={handleCloseCreateForm}
          onPlanCreated={handlePlanCreated}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 0,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
  },
  createButton: {
    backgroundColor: '#1e40af',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  centerContainer: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 20,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 20,
    color: '#9ca3af',
  },
  centerTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
    color: '#1f2937',
  },
  centerText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    color: '#6b7280',
  },
  createFirstButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  createFirstButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
  },
}); 