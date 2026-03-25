import { PlansRequestDto } from "@interfaces/plans/PlansRequestDto";
import { PlacesToEatResponseDto } from "@interfaces/placesToEat/PlacesToEatResponseDto";
import { PlacesToFunResponseDto } from "@interfaces/placesToFun/PlacesToFunResponseDto";
import { getCategoryEmoji } from "@utils/mapIcons";
import { EmptyState } from '@components/common';

interface User {
  id: number;
  name: string;
  email: string;
}

interface PlanPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  planData: PlansRequestDto;
  selectedPlaces: (PlacesToEatResponseDto | PlacesToFunResponseDto)[];
  selectedUsers: User[];
  isSubmitting: boolean;
}

export default function PlanPreviewModal({
  isOpen,
  onClose,
  onConfirm,
  planData,
  selectedPlaces,
  selectedUsers,
  isSubmitting
}: PlanPreviewModalProps) {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return "No especificada";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryName = (category: string) => {
    const categoryNames: Record<string, string> = {
      'RESTAURANT': 'Restaurante',
      'CAFE': 'Café',
      'BAR': 'Bar',
      'PARK': 'Parque',
      'ARCADE': 'Arcade',
      'CLUB': 'Club',
      'OTHER': 'Otro'
    };
    return categoryNames[category] || category;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            📋 Preview del Plan
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Información del plan */}
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
                  📝 Información del Plan
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Nombre:</span>
                    <p className="text-gray-900 dark:text-white font-semibold">{planData.name}</p>
                  </div>
                  {planData.description && (
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Descripción:</span>
                      <p className="text-gray-900 dark:text-white">{planData.description}</p>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Visibilidad:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      planData.visibility === 'PUBLIC' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
                    }`}>
                      {planData.visibility === 'PUBLIC' ? '🌍 Público' : '🔒 Privado'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">
                  📅 Fechas
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Inicio:</span>
                    <p className="text-gray-900 dark:text-white">{formatDate(planData.startDate || '')}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Fin:</span>
                    <p className="text-gray-900 dark:text-white">{formatDate(planData.endDate || '')}</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-3">
                  👥 Participantes ({selectedUsers.length})
                </h4>
                {selectedUsers.length > 0 ? (
                  <div className="space-y-2">
                    {selectedUsers.map((user) => (
                      <div key={user.id} className="flex items-center space-x-2 text-sm">
                        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-gray-900 dark:text-white">{user.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No hay participantes seleccionados</p>
                )}
              </div>
            </div>

            {/* Lugares seleccionados */}
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
              <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-3">
                🗺️ Lugares Seleccionados ({selectedPlaces.length})
              </h4>
              {selectedPlaces.length === 0 ? (
                <EmptyState message="No hay lugares seleccionados" />
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {selectedPlaces.map((place) => {
                    const category = place.hasOwnProperty('placeCategoryToEat')
                      ? (place as PlacesToEatResponseDto).placeCategoryToEat 
                      : (place as PlacesToFunResponseDto).placeCategoryToFun;
                    
                    return (
                      <div key={place.id} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-orange-200 dark:border-orange-700">
                        <div className="flex items-start space-x-3">
                          <span className="text-lg">{getCategoryEmoji(category)}</span>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900 dark:text-white text-sm">
                              {place.name}
                            </h5>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {getCategoryName(category)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              📍 {place.address}
                            </p>
                            {place.qualification && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                ⭐ {place.qualification}/5
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-400 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin">⏳</span>
                <span>Creando Plan...</span>
              </>
            ) : (
              <>
                <span>✅</span>
                <span>Crear Plan</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 