import React from 'react';
import { FormField } from '@components/common';
import { PlansRequestDto } from "@interfaces/plans/PlansRequestDto";

interface PlanFormFieldsProps {
  formData: PlansRequestDto;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  errors: { [key: string]: string };
}

export default function PlanFormFields({ formData, onInputChange, errors }: PlanFormFieldsProps) {
  const visibilityOptions = [
    { value: 'PUBLIC', label: '🌍 Público' },
    { value: 'PRIVATE', label: '🔒 Privado' }
  ];

  return (
    <div className="space-y-6 w-full">
      <FormField
        label="Nombre del Plan"
        name="name"
        type="text"
        value={formData.name || ''}
        onChange={onInputChange}
        placeholder="Ej: Plan de fin de semana"
        required
        error={errors.name}
      />
      
      <FormField
        label="Descripción"
        name="description"
        type="textarea"
        value={formData.description || ''}
        onChange={onInputChange}
        placeholder="Describe tu plan..."
        error={errors.description}
      />
      
      <FormField
        label="Fecha de Inicio"
        name="startDate"
        type="date"
        value={formData.startDate || ''}
        onChange={onInputChange}
        error={errors.startDate}
      />
      
      <FormField
        label="Fecha de Fin"
        name="endDate"
        type="date"
        value={formData.endDate || ''}
        onChange={onInputChange}
        min={formData.startDate}
        error={errors.endDate}
      />
      
      <FormField
        label="Visibilidad"
        name="visibility"
        type="select"
        value={formData.visibility || ''}
        onChange={onInputChange}
        options={visibilityOptions}
        error={errors.visibility}
      />
    </div>
  );
} 