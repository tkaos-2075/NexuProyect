import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

interface DateSelectorProps {
  label: string;
  value: string;
  onPress: () => void;
  displayText: string;
}

export default function DateSelector({ 
  label, 
  value, 
  onPress, 
  displayText 
}: DateSelectorProps) {
  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.label]}>{label}</Text>
      {Platform.OS === 'web' ? (
        <input
          style={{
            ...styles.dateInput,
            backgroundColor: '#ffffff',
            borderColor: '#d1d5db',
            color: '#1e293b',
            width: '100%',
            fontSize: 16,
            borderWidth: 1,
            borderRadius: 8,
            padding: 12,
            marginTop: 4,
            marginBottom: 4,
          }}
          type="date"
          value={value}
          onChange={e => onPress()}
          placeholder="YYYY-MM-DD"
        />
      ) : (
        <TouchableOpacity
          style={[
            styles.dateInput,
            { 
              backgroundColor: '#ffffff',
              borderColor: '#d1d5db'
            }
          ]}
          onPress={onPress}
          activeOpacity={0.7}
        >
          <Text style={[styles.dateInputText]}>
            {displayText}
          </Text>
          <Text style={styles.dateInputIcon}>📅</Text>
        </TouchableOpacity>
      )}
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
  dateInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateInputText: {
    fontSize: 16,
  },
  dateInputIcon: {
    fontSize: 20,
  },
}); 