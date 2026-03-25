import { useState, useEffect, useCallback, useRef } from "react";
import { PlansRequestDto } from "@interfaces/plans/PlansRequestDto";

const DRAFT_KEY = "nexu_plan_draft";
const AUTO_SAVE_DELAY = 5000; // Aumentado a 5 segundos para reducir frecuencia

interface PlanDraft extends PlansRequestDto {
  selectedPlaces: number[];
  selectedUsers: number[];
  lastModified: string;
}

export function usePlanDraft() {
  const [draft, setDraft] = useState<PlanDraft | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedDataRef = useRef<string>('');

  // Cargar borrador al inicializar
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        setDraft(parsedDraft);
        setHasUnsavedChanges(false);
        lastSavedDataRef.current = JSON.stringify(parsedDraft);
      } catch (error) {
        console.error("Error al cargar borrador:", error);
        localStorage.removeItem(DRAFT_KEY);
      }
    }
  }, []);

  // Función para guardar borrador
  const saveDraft = useCallback((planData: PlansRequestDto, selectedPlaces: number[], selectedUsers: number[]) => {
    const newDraft: PlanDraft = {
      ...planData,
      selectedPlaces,
      selectedUsers,
      lastModified: new Date().toISOString()
    };

    const draftString = JSON.stringify(newDraft);
    
    // Solo guardar si los datos han cambiado
    if (draftString !== lastSavedDataRef.current) {
      try {
        localStorage.setItem(DRAFT_KEY, draftString);
        setDraft(newDraft);
        setHasUnsavedChanges(false);
        lastSavedDataRef.current = draftString;
        console.log("Borrador guardado automáticamente");
      } catch (error) {
        console.error("Error al guardar borrador:", error);
      }
    }
  }, []);

  // Función para actualizar borrador con delay optimizado
  const updateDraft = useCallback((planData: PlansRequestDto, selectedPlaces: number[], selectedUsers: number[]) => {
    setHasUnsavedChanges(true);

    // Limpiar timer anterior
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    // Crear nuevo timer
    autoSaveTimerRef.current = setTimeout(() => {
      saveDraft(planData, selectedPlaces, selectedUsers);
    }, AUTO_SAVE_DELAY);
  }, [saveDraft]);

  // Función para limpiar borrador
  const clearDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_KEY);
    setDraft(null);
    setHasUnsavedChanges(false);
    lastSavedDataRef.current = '';
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }
  }, []);

  // Función para restaurar borrador
  const restoreDraft = useCallback(() => {
    return draft;
  }, [draft]);

  // Función para verificar si hay cambios sin guardar (optimizada)
  const checkForUnsavedChanges = useCallback((currentData: PlansRequestDto, currentPlaces: number[], currentUsers: number[]) => {
    if (!draft) return false;

    const currentDraft: PlanDraft = {
      ...currentData,
      selectedPlaces: currentPlaces,
      selectedUsers: currentUsers,
      lastModified: draft.lastModified
    };

    return JSON.stringify(currentDraft) !== lastSavedDataRef.current;
  }, [draft]);

  // Limpiar timer al desmontar
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  return {
    draft,
    hasUnsavedChanges,
    saveDraft,
    updateDraft,
    clearDraft,
    restoreDraft,
    checkForUnsavedChanges
  };
} 