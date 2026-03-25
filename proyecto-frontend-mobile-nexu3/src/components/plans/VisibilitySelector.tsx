import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface VisibilitySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function VisibilitySelector({ 
  value, 
  onChange 
}: VisibilitySelectorProps) {
  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.label]}>Visibilidad</Text>
      <View style={styles.visibilityContainer}>
        <TouchableOpacity
          style={[
            styles.visibilityOption,
            value === 'PUBLIC' && styles.visibilityOptionActive,
            { 
              backgroundColor: value === 'PUBLIC' 
                ? '#dbeafe' 
                : '#f8fafc',
              borderColor: '#d1d5db'
            }
          ]}
          onPress={() => onChange('PUBLIC')}
        >
          <Text style={styles.visibilityIcon}>🌍</Text>
          <Text style={[styles.visibilityText]}>Público</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.visibilityOption,
            value === 'PRIVATE' && styles.visibilityOptionActive,
            { 
              backgroundColor: value === 'PRIVATE' 
                ? '#dbeafe' 
                : '#f8fafc',
              borderColor: '#d1d5db'
            }
          ]}
          onPress={() => onChange('PRIVATE')}
        >
          <Text style={styles.visibilityIcon}>🔒</Text>
          <Text style={[styles.visibilityText]}>Privado</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  visibilityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  visibilityOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 8,
  },
  visibilityOptionActive: {
    borderColor: '#3b82f6',
  },
  visibilityIcon: {
    fontSize: 16,
  },
  visibilityText: {
    fontSize: 16,
    fontWeight: '500',
  },
}); 