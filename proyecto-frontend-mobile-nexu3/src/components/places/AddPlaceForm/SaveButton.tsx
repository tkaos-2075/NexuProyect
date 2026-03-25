import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useTheme } from 'react-native-paper';

interface SaveButtonProps {
  onPress: () => void;
  loading: boolean;
}

export default function SaveButton({ onPress, loading }: SaveButtonProps) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={{ backgroundColor: colors.primary, padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 12 }}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.onPrimary} />
      ) : (
        <Text style={{ color: colors.onPrimary, fontWeight: 'bold', fontSize: 16 }}>Agregar Lugar</Text>
      )}
    </TouchableOpacity>
  );
} 