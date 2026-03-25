import { useState, useCallback } from 'react';

interface UseFormProps<T> {
  initialValues: T;
  onSubmit: (values: T) => Promise<void> | void;
  validate?: (values: T) => { [K in keyof T]?: string };
}

export const useForm = <T extends Record<string, any>>({
  initialValues,
  onSubmit,
  validate
}: UseFormProps<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Manejar cambios en los campos
  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    let newValue: any = value;
    
    if (type === 'checkbox' && 'checked' in e.target) {
      newValue = (e.target as HTMLInputElement).checked;
    }

    setValues(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    setHasChanges(true);
    
    // Limpiar error del campo si existe
    if (errors[name as keyof T]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  }, [errors]);

  // Manejar cambios directos (para casos especiales)
  const setValue = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
    setHasChanges(true);
  }, []);

  // Validar formulario
  const validateForm = useCallback(() => {
    if (!validate) return { isValid: true, errors: {} };
    
    const validationErrors = validate(values);
    setErrors(validationErrors);
    
    return {
      isValid: Object.keys(validationErrors).length === 0,
      errors: validationErrors
    };
  }, [values, validate]);

  // Enviar formulario
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const validation = validateForm();
    if (!validation.isValid) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      setHasChanges(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateForm, onSubmit]);

  // Resetear formulario
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setHasChanges(false);
    setIsSubmitting(false);
  }, [initialValues]);

  // Restaurar valores
  const setValuesFromDraft = useCallback((draftValues: Partial<T>) => {
    setValues(prev => ({
      ...prev,
      ...draftValues
    }));
    setHasChanges(true);
  }, []);

  return {
    // Estado
    values,
    errors,
    isSubmitting,
    hasChanges,
    
    // Acciones
    handleChange,
    setValue,
    handleSubmit,
    reset,
    setValuesFromDraft,
    validateForm,
    
    // Utilidades
    setValues,
    setErrors
  };
}; 