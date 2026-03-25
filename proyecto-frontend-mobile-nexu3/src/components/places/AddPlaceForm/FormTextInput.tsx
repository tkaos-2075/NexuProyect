import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { useTheme } from 'react-native-paper';

interface FormTextInputProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  placeholder?: string;
}

export default function FormTextInput({ 
  label, 
  value, 
  onChangeText, 
  error, 
  placeholder,
  ...textInputProps 
}: FormTextInputProps) {
  const { colors } = useTheme();
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontWeight: '600', marginBottom: 4, color: colors.onSurface }}>{label}</Text>
      <TextInput
        style={{ 
          borderWidth: 1, 
          borderColor: error ? colors.error : colors.outline, 
          borderRadius: 8, 
          padding: 10, 
          marginBottom: 4,
          backgroundColor: colors.surface,
          color: colors.onSurface,
          fontSize: 16,
        }}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.onSurfaceVariant}
        {...textInputProps}
      />
      {error && <Text style={{ color: colors.error, fontSize: 13 }}>{error}</Text>}
    </View>
  );
} 