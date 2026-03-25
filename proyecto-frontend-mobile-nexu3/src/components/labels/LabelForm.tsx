import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import { LabelsRequestDto, LabelsStatus } from '@interfaces/labels/LabelsRequestDto';

export interface LabelFormProps {
  onSubmit: (data: Omit<LabelsRequestDto, 'id'>) => Promise<void>;
  isLoading?: boolean;
  initialData?: Omit<LabelsRequestDto, 'id'>;
  submitText?: string;
  onCancel?: () => void;
}

const STATUS_OPTIONS: { label: string; value: LabelsStatus }[] = [
  { label: 'Activo', value: 'ACTIVE' },
  { label: 'Inactivo', value: 'INACTIVE' },
];

// Colores predefinidos para selección rápida
const PRESET_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', 
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#ec4899',
  '#f43f5e', '#6b7280', '#374151', '#1f2937', '#111827'
];

export default function LabelForm({ 
  onSubmit, 
  isLoading = false, 
  initialData,
  submitText = 'Crear Etiqueta',
  onCancel
}: LabelFormProps) {
  
  const [form, setForm] = useState<Omit<LabelsRequestDto, 'id'>>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    color: initialData?.color || '#3182ce',
    status: initialData?.status || 'ACTIVE',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [tempColor, setTempColor] = useState(form.color);

  useEffect(() => {
    setForm({
      name: initialData?.name || '',
      description: initialData?.description || '',
      color: initialData?.color || '#3182ce',
      status: initialData?.status || 'ACTIVE',
    });
    setTempColor(initialData?.color || '#3182ce');
    setErrors({});
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof typeof form, string>> = {};
    if (!form.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (form.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    } else if (form.name.trim().length > 50) {
      newErrors.name = 'El nombre no puede exceder 50 caracteres';
    }
    if (form.description && form.description.length > 200) {
      newErrors.description = 'La descripción no puede exceder 200 caracteres';
    }
    if (!form.color) {
      newErrors.color = 'El color es requerido';
    } else if (!/^#[0-9A-F]{6}$/i.test(form.color)) {
      newErrors.color = 'El color debe ser un código hexadecimal válido';
    }
    if (!form.status) {
      newErrors.status = 'El estado es requerido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    await onSubmit(form);
  };

  const handleColorChange = (color: string) => {
    setTempColor(color);
  };

  const handleColorConfirm = () => {
    setForm(f => ({ ...f, color: tempColor }));
    setShowColorPicker(false);
  };

  const handleStatusSelect = (status: LabelsStatus) => {
    setForm(f => ({ ...f, status }));
  };

  const openColorPicker = () => {
    setTempColor(form.color);
    setShowColorPicker(true);
  };



  return (
    <View style={styles.container}>
      <Text style={styles.title}>{initialData ? 'Editar Etiqueta' : 'Crear Nueva Etiqueta'}</Text>
      
      {/* Nombre */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nombre *</Text>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          value={form.name}
          onChangeText={text => setForm(f => ({ ...f, name: text }))}
          placeholder="Ej: Restaurante, Bar, Café..."
          editable={!isLoading}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      </View>

      {/* Color */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Color *</Text>
        <TouchableOpacity
          style={styles.colorPickerButton}
          onPress={openColorPicker}
          disabled={isLoading}
        >
          <View style={[styles.colorPreview, { backgroundColor: form.color }]} />
          <Text style={styles.colorPickerText}>
            Seleccionar Color
          </Text>
          <Text style={styles.colorCode}>{form.color}</Text>
        </TouchableOpacity>
        {errors.color && <Text style={styles.errorText}>{errors.color}</Text>}
      </View>

      {/* Descripción */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Descripción <Text style={{ color: '#9ca3af' }}>(opcional)</Text></Text>
        <TextInput
          style={[styles.input, styles.textArea, errors.description && styles.inputError]}
          value={form.description}
          onChangeText={text => setForm(f => ({ ...f, description: text }))}
          placeholder="Descripción de la etiqueta..."
          editable={!isLoading}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
        {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
        <Text style={styles.charCount}>{(form.description || '').length}/200 caracteres</Text>
      </View>

      {/* Estado */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Estado *</Text>
        <View style={styles.statusSelector}>
          {STATUS_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.statusOption,
                form.status === option.value && styles.statusOptionSelected
              ]}
              onPress={() => handleStatusSelect(option.value)}
              disabled={isLoading}
            >
              <Text style={[
                styles.statusOptionText,
                form.status === option.value && styles.statusOptionTextSelected
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.status && <Text style={styles.errorText}>{errors.status}</Text>}
      </View>

      {/* Botones */}
      <View style={styles.buttonRow}>
        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
          style={styles.submitButton}
          labelStyle={styles.submitButtonText}
        >
          {isLoading ? 'Guardando...' : submitText}
        </Button>
        {onCancel && (
          <Button
            mode="outlined"
            onPress={onCancel}
            style={styles.cancelButton}
            labelStyle={styles.cancelButtonText}
            disabled={isLoading}
          >
            Cancelar
          </Button>
        )}
      </View>

      {/* Modal del Color Picker Simplificado */}
      <Modal
        visible={showColorPicker}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Seleccionar Color</Text>
            <TouchableOpacity
              onPress={() => setShowColorPicker(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.colorPickerContainer}>
            {/* Colores predefinidos */}
            <View style={styles.presetColorsContainer}>
              <Text style={styles.presetTitle}>Selecciona un color:</Text>
              <View style={styles.presetColorsGrid}>
                {PRESET_COLORS.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.presetColor,
                      { backgroundColor: color },
                      tempColor === color && styles.presetColorSelected
                    ]}
                    onPress={() => setTempColor(color)}
                  />
                ))}
              </View>
            </View>
            

          </ScrollView>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelModalButton}
              onPress={() => setShowColorPicker(false)}
            >
              <Text style={styles.cancelModalButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmModalButton}
              onPress={handleColorConfirm}
            >
              <Text style={styles.confirmModalButtonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#ffffff',
    minHeight: 350,
    borderWidth: 2,
    borderColor: '#3b82f6',
    borderRadius: 12,
    margin: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 18,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#1e293b',
  },
  colorPickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#ffffff',
  },
  colorPreview: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#d1d5db',
    marginRight: 12,
  },
  colorPickerText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  colorCode: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'monospace',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  statusSelector: {
    flexDirection: 'row',
    gap: 4,
  },
  statusOption: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    alignItems: 'center',
  },
  statusOptionSelected: {
    backgroundColor: '#f0f9ff',
    borderColor: '#3b82f6',
  },
  statusOptionText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6b7280',
  },
  statusOptionTextSelected: {
    color: '#1e40af',
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: '#1e40af',
    borderRadius: 8,
    paddingVertical: 4,
    minWidth: 120,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    borderColor: '#d1d5db',
    minWidth: 120,
    marginLeft: 10,
  },
  cancelButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 12,
    marginTop: 4,
  },
  charCount: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
    textAlign: 'right',
  },
  inputError: {
    borderColor: '#dc2626',
    backgroundColor: '#fef2f2',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#6b7280',
  },
  colorPickerContainer: {
    flex: 1,
    padding: 20,
  },

  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  cancelModalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  cancelModalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
  confirmModalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#1e40af',
  },
  confirmModalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  // Estilos para el color picker simplificado
  presetColorsContainer: {
    marginBottom: 20,
  },
  presetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  presetColorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetColor: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  presetColorSelected: {
    borderColor: '#1e40af',
    borderWidth: 3,
  },
}); 