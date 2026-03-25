import { useEffect, useState } from "react";
import { PlacesToEatResponseDto } from "@interfaces/placesToEat/PlacesToEatResponseDto";
import { PlacesToFunResponseDto } from "@interfaces/placesToFun/PlacesToFunResponseDto";
import { createPlan } from "@services/plans/createPlan";
import { usePlanDraft } from "@hooks/usePlanDraft";
import { AuthorizationGuard } from '@components/common';
import { SaveButton } from '@components/forms';
import { useForm } from '@hooks/useForm';
import { useSelection } from '@hooks/useSelection';
import { PlansRequestDto } from "@interfaces/plans/PlansRequestDto";
import PlanFormFields from './PlanFormFields';
import PlaceSelection from './PlaceSelection';
import UserSelection from './UserSelection';
import UnsavedChangesModal from "@components/modals/UnsavedChangesModal";
import AlertModal from '@components/ui/AlertToast';
import { useToast } from '@components/ui/SimpleToast';

interface User {
  id: number;
  name: string;
  email: string;
  username?: string;
}

interface CreatePlanFormProps {
  places: (PlacesToEatResponseDto | PlacesToFunResponseDto)[];
  onClose: () => void;
  onPlanCreated?: () => void;
}

export default function CreatePlanForm({ places, onClose, onPlanCreated }: CreatePlanFormProps) {
  const { updateDraft, clearDraft, restoreDraft } = usePlanDraft();
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { ToastContainer } = useToast();

  // Hook para manejar el formulario
  const {
    values: formData,
    errors,
    isSubmitting,
    hasChanges,
    handleChange,
    handleSubmit,
    setValuesFromDraft
  } = useForm<PlansRequestDto>({
    initialValues: {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      visibility: "PUBLIC",
      usersId: [],
      placesId: []
    },
    onSubmit: async (values) => {
      const planData: PlansRequestDto = {
        ...values,
        placesId: selectedPlaces
      };

      await createPlan(planData);
      clearDraft();
      onPlanCreated?.();
      if (onClose) setTimeout(onClose, 1200);
      setShowConfirmation(true);
    },
    validate: (values) => {
      const errors: { [key: string]: string } = {};

      if (!values.name?.trim()) {
        errors.name = "El nombre del plan es obligatorio";
      }

      if (values.startDate && values.endDate) {
        const startDate = new Date(values.startDate);
        const endDate = new Date(values.endDate);
        
        if (startDate >= endDate) {
          errors.endDate = "La fecha de fin debe ser posterior a la fecha de inicio";
        }
      }

      if (selectedPlaces.length === 0) {
        errors.places = "Debes seleccionar al menos un lugar";
      }

      return errors;
    }
  });

  // Hook para manejar selección de lugares
  const {
    selectedItems: selectedPlaces,
    toggleItem: togglePlace
  } = useSelection<number>();

  // Estado para usuarios seleccionados
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  // Cargar borrador al inicializar
  useEffect(() => {
    const savedDraft = restoreDraft();
    if (savedDraft) {
      setValuesFromDraft({
        name: savedDraft.name || "",
        description: savedDraft.description || "",
        startDate: savedDraft.startDate || "",
        endDate: savedDraft.endDate || "",
        visibility: savedDraft.visibility || "PUBLIC",
        usersId: savedDraft.usersId || [],
        placesId: savedDraft.placesId || []
      });
      
      // Restaurar lugares seleccionados
      if (savedDraft.selectedPlaces) {
        savedDraft.selectedPlaces.forEach(placeId => togglePlace(placeId));
      }
      
      // Restaurar usuarios seleccionados
      if (savedDraft.selectedUsers) {
        setSelectedUsers(savedDraft.selectedUsers.map(id => ({
          id,
          name: `Usuario ${id}`,
          email: `usuario${id}@nexu.com`
        })));
      }
    }
  }, []);

  // Actualizar borrador cuando cambien los datos
  useEffect(() => {
    if (hasChanges) {
      const timeoutId = setTimeout(() => {
        updateDraft(formData, selectedPlaces, selectedUsers.map(u => u.id));
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [formData, selectedPlaces, selectedUsers, hasChanges, updateDraft]);

  const handleUserSelection = (userIds: number[]) => {
    const users = userIds.map(id => ({
      id,
      name: `Usuario ${id}`,
      email: `usuario${id}@nexu.com`
    }));
    setSelectedUsers(users);
    // Actualizar el formulario directamente
    formData.usersId = userIds;
  };

  const handleConfirmClose = () => {
    clearDraft();
    setShowUnsavedModal(false);
    onClose();
  };

  return (
    <AuthorizationGuard requiredRole="USER" message="No tienes permisos para crear planes.">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 w-full h-full flex flex-col overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Crear Nuevo Plan
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 dark:hover:text-white text-2xl font-bold focus:outline-none"
            title="Cerrar"
          >
            ✕
          </button>
        </div>
        <hr className="border-gray-200 dark:border-gray-700 mb-8" />
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full flex-1">
          <PlanFormFields
            formData={formData}
            onInputChange={handleChange}
            errors={errors}
          />
          <UserSelection
            selectedUsers={selectedUsers}
            onUserSelection={handleUserSelection}
          />
          <PlaceSelection
            places={places}
            selectedPlaces={selectedPlaces}
            onTogglePlace={togglePlace}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <div className="pt-4 w-full mt-auto">
            <SaveButton 
              loading={isSubmitting} 
              text="Guardar Plan" 
              disabled={!formData.name?.trim()} 
            />
          </div>
        </form>
      </div>
      {/* Modales */}
      <UnsavedChangesModal
        isOpen={showUnsavedModal}
        onConfirm={handleConfirmClose}
        onCancel={() => setShowUnsavedModal(false)}
      />
      <AlertModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        title="¡Plan guardado exitosamente!"
        message="Tu plan ha sido creado y guardado correctamente."
        icon="🎉"
        buttonText="Cerrar"
      />
      <ToastContainer />
    </AuthorizationGuard>
  );
} 