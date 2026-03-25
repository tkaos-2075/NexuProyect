import { useState, useEffect } from "react";
import { LabelsRequestDto, LabelsStatus } from "@interfaces/labels/LabelsRequestDto";
import { LabelsResponseDto } from "@interfaces/labels/LabelsResponseDto";
import SubmitButton from './SaveButton';
import ValidationErrors from './FormTextInput';

export interface LabelFormProps {
  onSave: (l: Omit<LabelsRequestDto, "id">) => void;
  label?: LabelsResponseDto;
  onCancel?: () => void;
}

export default function LabelForm({ onSave, label, onCancel }: LabelFormProps) {
  // Estado local para el formulario
  const [form, setForm] = useState<Omit<LabelsRequestDto, "id">>({
    name: label?.name || "",
    description: label?.description || "",
    color: label?.color || "#3182ce",
    status: label?.status || "ACTIVE",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Actualiza el formulario si cambia la etiqueta a editar
  useEffect(() => {
    setForm({
      name: label?.name || "",
      description: label?.description || "",
      color: label?.color || "#3182ce",
      status: label?.status || "ACTIVE",
    });
    // Limpiar errores cuando cambia la etiqueta
    setErrors({});
  }, [label]);

  // Función de validación
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof typeof form, string>> = {};

    // Validar nombre
    if (!form.name.trim()) {
      newErrors.name = "El nombre es requerido";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres";
    } else if (form.name.trim().length > 50) {
      newErrors.name = "El nombre no puede exceder 50 caracteres";
    }

    // Validar descripción
    if (form.description && form.description.length > 200) {
      newErrors.description = "La descripción no puede exceder 200 caracteres";
    }

    // Validar color
    if (!form.color) {
      newErrors.color = "El color es requerido";
    } else if (!/^#[0-9A-F]{6}$/i.test(form.color)) {
      newErrors.color = "El color debe ser un código hexadecimal válido";
    }

    // Validar estado
    if (!form.status) {
      newErrors.status = "El estado es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(form);
    } catch (error) {
      console.error('Error al guardar etiqueta:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card glass-card fade-in-up max-w-xl mx-auto mb-8 p-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Nombre *</label>
          <input
            type="text"
            className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-base text-gray-900 dark:text-white ${
              errors.name 
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900'
            }`}
            value={form.name}
            required
            onChange={(e) => {
              setForm((f) => ({ ...f, name: e.target.value }));
              // Limpiar error cuando el usuario empiece a escribir
              if (errors.name) {
                setErrors(prev => ({ ...prev, name: undefined }));
              }
            }}
            placeholder="Ej: Restaurante, Bar, Café..."
          />
          <ValidationErrors errors={errors.name ? [errors.name] : []} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Color *</label>
          <div className="flex items-center space-x-4">
            <input
              type="color"
              className="w-12 h-12 p-0 border-0 bg-transparent rounded-full shadow cursor-pointer"
              value={form.color}
              required
              onChange={(e) => {
                setForm((f) => ({ ...f, color: e.target.value }));
                if (errors.color) {
                  setErrors(prev => ({ ...prev, color: undefined }));
                }
              }}
            />
            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">{form.color}</span>
          </div>
          <ValidationErrors errors={errors.color ? [errors.color] : []} />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">
          Descripción <span className="text-gray-400">(opcional)</span>
        </label>
        <input
          type="text"
          className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-base text-gray-900 dark:text-white ${
            errors.description 
              ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
              : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900'
          }`}
          value={form.description}
          onChange={(e) => {
            setForm((f) => ({ ...f, description: e.target.value }));
            if (errors.description) {
              setErrors(prev => ({ ...prev, description: undefined }));
            }
          }}
          placeholder="Descripción de la etiqueta..."
        />
        <ValidationErrors errors={errors.description ? [errors.description] : []} />
        <div className="text-xs text-gray-400 mt-1">
          {(form.description || '').length}/200 caracteres
        </div>
      </div>
      <div className="mb-6">
        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Estado *</label>
        <select
          className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-base text-gray-900 dark:text-white ${
            errors.status 
              ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
              : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900'
          }`}
          value={form.status}
          onChange={(e) => {
            setForm((f) => ({ ...f, status: e.target.value as LabelsStatus }));
            if (errors.status) {
              setErrors(prev => ({ ...prev, status: undefined }));
            }
          }}
        >
          <option value="ACTIVE">Activo</option>
          <option value="INACTIVE">Inactivo</option>
        </select>
        <ValidationErrors errors={errors.status ? [errors.status] : []} />
      </div>
      <div className="flex space-x-3 pt-2 justify-end">
        <SubmitButton loading={isSubmitting} text={label ? "Actualizar" : "Crear"} />
        {onCancel && (
          <button
            type="button"
            className="btn-secondary min-w-[120px]"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
} 