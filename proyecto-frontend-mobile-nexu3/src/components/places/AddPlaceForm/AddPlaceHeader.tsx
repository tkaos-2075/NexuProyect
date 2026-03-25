import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';

interface AddPlaceHeaderProps {
  onClose: () => void;
}

export default function AddPlaceHeader({ onClose }: AddPlaceHeaderProps) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.outline }}>
      <TouchableOpacity onPress={onClose} style={{ padding: 8 }}>
        <Text style={{ fontSize: 22, color: colors.onSurfaceVariant }}>{'\u2715'}</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 12, color: colors.onSurface }}>Agregar Lugar</Text>
    </View>
  );
} 