import React, { useState, useEffect, useCallback } from "react";
import { 
  View, 
  Modal, 
  StyleSheet, 
  SafeAreaView,
  Platform,
} from "react-native";
import { Button } from 'react-native-paper';
import { PlansRequestDto } from "@interfaces/plans/PlansRequestDto";
import { PlacesToEatResponseDto } from "@interfaces/placesToEat/PlacesToEatResponseDto";
import { PlacesToFunResponseDto } from "@interfaces/placesToFun/PlacesToFunResponseDto";
import { createPlan } from "@services/plans/createPlan";
import UserSelectionModal from '@components/UserSelectionModal';
import AlertToast from '@components/AlertToast';
import { getRoleBasedOnToken } from '@utils/getRoleBasedOnToken';
import SimpleToast from '@components/SimpleToast';
import DateTimePicker from '@react-native-community/datetimepicker';
import KeyboardAwareScrollView from '@components/KeyboardAwareScrollView';

// Importar componentes separados
import FormHeader from './FormHeader';
import FormTextInput from './FormTextInput';
import DateSelector from './DateSelector';
import VisibilitySelector from './VisibilitySelector';
import UserSelector from './UserSelector';
import PlacesList from './PlacesList';
import ConfirmationModal from './ConfirmationModal';
import { User, CreatePlanFormProps } from './types';

export default function CreatePlanForm({ 
  places, 
  onClose, 
  onPlanCreated, 
  onSubmit, 
  isLoading = false, 
  initialName = '', 
  initialDescription = '', 
  submitText = 'Crear Plan' 
}: CreatePlanFormProps) {
  const [formData, setFormData] = useState<PlansRequestDto>({
    name: initialName,
    description: initialDescription,
    startDate: "",
    endDate: "",
    visibility: "PUBLIC",
    usersId: [],
    placesId: []
  });

  const [selectedPlaces, setSelectedPlaces] = useState<number[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' }>({ message: '', type: 'info' });
  const [showUnauthorized, setShowUnauthorized] = useState(false);

  // Estados para el selector de fechas
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Verificar permisos
  useEffect(() => {
    const checkRole = async () => {
      try {
        const role = await getRoleBasedOnToken();
        if (role === 'VIEWER') setShowUnauthorized(true);
      } catch {}
    };
    checkRole();
  }, []);

  const handleInputChange = useCallback((name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setHasChanges(true);
  }, []);

  const handlePlaceToggle = useCallback((placeId: number) => {
    setSelectedPlaces(prev => {
      if (prev.includes(placeId)) {
        return prev.filter(id => id !== placeId);
      } else {
        return [...prev, placeId];
      }
    });
    setHasChanges(true);
  }, []);

  const handleUserSelection = useCallback((userIds: number[]) => {
    const users = userIds.map(id => ({
      id,
      name: `Usuario ${id}`,
      email: `usuario${id}@example.com`
    }));
    setSelectedUsers(users);
    setFormData(prev => ({
      ...prev,
      usersId: userIds
    }));
    setHasChanges(true);
  }, []);

  const validateForm = useCallback((): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!formData.name.trim()) {
      errors.push("El nombre del plan es obligatorio");
    }

    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      
      if (startDate >= endDate) {
        errors.push("La fecha de fin debe ser posterior a la fecha de inicio");
      }
    }

    if (selectedPlaces.length === 0) {
      errors.push("Debes seleccionar al menos un lugar");
    }

    return { isValid: errors.length === 0, errors };
  }, [formData, selectedPlaces]);

  // Función para formatear fecha a YYYY-MM-DD
  const formatDateForBackend = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Función para formatear fecha para mostrar al usuario
  const formatDateForDisplay = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Función para parsear fecha desde string
  const parseDateFromString = (dateString: string): Date => {
    if (!dateString) return new Date();
    
    // Si ya está en formato YYYY-MM-DD
    if (dateString.includes('-')) {
      const [year, month, day] = dateString.split('-').map(Number);
      return new Date(year, month - 1, day);
    }
    
    // Si está en formato DD/MM/YYYY
    if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/').map(Number);
      return new Date(year, month - 1, day);
    }
    
    return new Date();
  };

  // Manejadores para el selector de fechas
  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
      const formattedDate = formatDateForBackend(selectedDate);
      setFormData(prev => ({
        ...prev,
        startDate: formattedDate
      }));
      setHasChanges(true);
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
      const formattedDate = formatDateForBackend(selectedDate);
      setFormData(prev => ({
        ...prev,
        endDate: formattedDate
      }));
      setHasChanges(true);
    }
  };

  // Inicializar fechas cuando se monta el componente
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    setStartDate(today);
    setEndDate(tomorrow);
    
    setFormData(prev => ({
      ...prev,
      startDate: formatDateForBackend(today),
      endDate: formatDateForBackend(tomorrow)
    }));
  }, []);

  const handleSubmit = async () => {
    const validation = validateForm();
    if (!validation.isValid) {
      // Mostrar solo el primer error para evitar múltiples toasts
      setToast({ message: validation.errors[0], type: 'error' });
      return;
    }

    try {
      // Crear el plan usando el servicio directamente
      const planData = {
        name: formData.name.trim(),
        description: formData.description?.trim() ?? '',
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
        visibility: formData.visibility,
        usersId: selectedUsers.map(user => user.id),
        placesId: selectedPlaces
      };
      
      console.log('Enviando plan al backend:', planData);
      await createPlan(planData);
      
      // Limpiar el formulario
      setFormData(prev => ({
        ...prev,
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        visibility: 'PUBLIC',
        usersId: [],
        placesId: []
      }));
      setSelectedPlaces([]);
      setSelectedUsers([]);
      
      // Llamar al callback de éxito y cerrar el formulario
      onPlanCreated?.();
      if (onClose) setTimeout(onClose, 500);
      setShowConfirmation(true);
    } catch (error: any) {
      console.error("Error al crear el plan:", error);
      
      let errorMessage = "Error al crear el plan. Inténtalo de nuevo.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setToast({ message: errorMessage, type: 'error' });
    }
  };

  if (showUnauthorized) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#e0f2fe' }]}>
        <AlertToast
          message="No tienes permisos para crear planes."
          onClose={onClose}
          duration={3000}
        />
      </SafeAreaView>
    );
  }

  return (
    <Modal
      visible={true}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <SafeAreaView style={[styles.container, { backgroundColor: '#e0f2fe' }]}>
        <KeyboardAwareScrollView style={styles.scrollView}>
          <FormHeader 
            onClose={onClose} 
            title={initialName ? 'Editar Plan' : 'Crear Nuevo Plan'} 
          />

          <View style={[styles.form, { backgroundColor: '#fff' }]}>
            {/* Nombre del Plan */}
            <FormTextInput
              label="Nombre del Plan *"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholder="Ej: Plan de fin de semana"
              editable={!isLoading}
            />

            {/* Descripción */}
            <FormTextInput
              label="Descripción"
              value={formData.description ?? ''}
              onChangeText={(value) => handleInputChange('description', value)}
              placeholder="Describe tu plan..."
              multiline
              numberOfLines={4}
              editable={!isLoading}
            />

            {/* Fecha de Inicio */}
            <DateSelector
              label="Fecha de Inicio"
              value={formData.startDate || ''}
              onPress={() => setShowStartDatePicker(true)}
              displayText={formData.startDate ? formatDateForDisplay(parseDateFromString(formData.startDate)) : 'Seleccionar fecha'}
            />

            {/* Fecha de Fin */}
            <DateSelector
              label="Fecha de Fin"
              value={formData.endDate || ''}
              onPress={() => setShowEndDatePicker(true)}
              displayText={formData.endDate ? formatDateForDisplay(parseDateFromString(formData.endDate)) : 'Seleccionar fecha'}
            />

            {/* Visibilidad */}
            <VisibilitySelector
              value={formData.visibility || 'PUBLIC'}
              onChange={(value) => handleInputChange('visibility', value)}
            />

            {/* Participantes */}
            <UserSelector
              selectedUsers={selectedUsers}
              onPress={() => setShowUserModal(true)}
            />

            {/* Lugares */}
            <PlacesList
              places={places}
              selectedPlaces={selectedPlaces}
              onTogglePlace={handlePlaceToggle}
              search={search}
              onSearchChange={setSearch}
            />

            {/* Botón de Guardar */}
            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={isLoading}
              disabled={isLoading || !formData.name.trim() || !(formData.description?.trim() ?? '')}
              style={styles.submitButton}
              labelStyle={styles.submitButtonText}
            >
              {isLoading ? 'Guardando...' : submitText}
            </Button>
          </View>
        </KeyboardAwareScrollView>

        {/* Modales */}
        <UserSelectionModal
          isOpen={showUserModal}
          onClose={() => setShowUserModal(false)}
          onConfirm={handleUserSelection}
          initialSelectedIds={selectedUsers.map(u => u.id)}
        />

        <ConfirmationModal
          visible={showConfirmation}
          onClose={() => setShowConfirmation(false)}
        />

        {/* Selectores de fecha solo en móvil */}
        {Platform.OS !== 'web' && showStartDatePicker && (
          <DateTimePicker
            value={startDate || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleStartDateChange}
            minimumDate={new Date()}
          />
        )}

        {Platform.OS !== 'web' && showEndDatePicker && (
          <DateTimePicker
            value={endDate || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleEndDateChange}
            minimumDate={startDate || new Date()}
          />
        )}

        {toast.message && (
          <SimpleToast 
            message={toast.message} 
            type={toast.type} 
            onHide={() => setToast({ ...toast, message: '' })} 
          />
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 20,
    gap: 20,
  },
  submitButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 