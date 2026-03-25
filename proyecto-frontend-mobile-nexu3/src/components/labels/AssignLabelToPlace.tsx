import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { Menu } from 'react-native-paper';
import { getAllLabels } from '@services/labels/getAllLabels';
import { assignLabelToPlace } from '@services/labels/assignLabelToPlace';
import { LabelsResponseDto } from '@interfaces/labels/LabelsResponseDto';
import SimpleToast from '@components/SimpleToast';

interface AssignLabelToPlaceProps {
  placeId: number;
  onAssigned?: () => void;
}

export default function AssignLabelToPlace({ placeId, onAssigned }: AssignLabelToPlaceProps) {
  const [labels, setLabels] = useState<LabelsResponseDto[]>([]);
  const [selectedLabel, setSelectedLabel] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' as 'success' | 'error' });
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    getAllLabels().then(res => setLabels(res.data)).catch(() => setLabels([]));
  }, []);

  const handleAssign = async () => {
    if (!selectedLabel) return;
    setLoading(true);
    try {
      await assignLabelToPlace(Number(selectedLabel), placeId);
      setToast({ message: 'Etiqueta asignada correctamente.', type: 'success' });
      setSelectedLabel('');
      if (onAssigned) onAssigned();
    } catch (error) {
      setToast({ message: 'Error al asignar la etiqueta.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🏷️ Asignar Etiqueta</Text>
        <Text style={styles.subtitle}>Ayuda a otros usuarios a encontrar este lugar</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.label}>Selecciona una etiqueta:</Text>
        <View style={styles.pickerWrapper}>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setMenuVisible(true)}
                style={styles.picker}
                contentStyle={styles.pickerContent}
              >
                {selectedLabel ? 
                  labels.find(label => label.id.toString() === selectedLabel)?.name || 'Selecciona una etiqueta' : 
                  'Selecciona una etiqueta'
                }
              </Button>
            }
          >
            {labels.map(label => (
              <Menu.Item
                key={label.id}
                onPress={() => {
                  setSelectedLabel(label.id.toString());
                  setMenuVisible(false);
                }}
                title={label.name}
                titleStyle={{ 
                  color: selectedLabel === label.id.toString() ? '#3b82f6' : '#111827',
                  fontWeight: selectedLabel === label.id.toString() ? '600' : '400'
                }}
              />
            ))}
          </Menu>
        </View>
        
        <TouchableOpacity
          style={[styles.button, (!selectedLabel || loading) && styles.buttonDisabled]}
          onPress={handleAssign}
          disabled={loading || !selectedLabel}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>✓ Asignar Etiqueta</Text>
          )}
        </TouchableOpacity>
      </View>
      
      {toast.message ? (
        <SimpleToast message={toast.message} type={toast.type} onHide={() => setToast({ ...toast, message: '' })} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  content: {
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  pickerWrapper: {
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f8fafc',
  },
  picker: {
    borderWidth: 1,
    borderRadius: 8,
    width: '100%',
  },
  pickerContent: {
    paddingVertical: 8,
  },
  button: {
    backgroundColor: '#1e40af',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#1e40af',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 