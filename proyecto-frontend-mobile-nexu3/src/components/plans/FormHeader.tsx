import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface FormHeaderProps {
  onClose: () => void;
  title: string;
}

export default function FormHeader({ onClose, title }: FormHeaderProps) {
  return (
    <View style={[styles.header, { backgroundColor: '#fff' }]}>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Text style={[styles.closeButtonText]}>✕</Text>
      </TouchableOpacity>
      <Text style={[styles.title]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
}); 