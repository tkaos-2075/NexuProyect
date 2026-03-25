import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

interface ConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function ConfirmationModal({ 
  visible, 
  onClose 
}: ConfirmationModalProps) {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.confirmationOverlay}>
        <View style={[styles.confirmationModal, { backgroundColor: '#fff' }]}>
          <Text style={styles.confirmationIcon}>🎉</Text>
          <Text style={[styles.confirmationTitle]}>¡Plan guardado exitosamente!</Text>
          <Text style={[styles.confirmationMessage]}>
            Tu plan ha sido creado y guardado correctamente.
          </Text>
          <TouchableOpacity
            style={[styles.confirmationButton]}
            onPress={onClose}
          >
            <Text style={styles.confirmationButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  confirmationOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  confirmationModal: {
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    maxWidth: 300,
  },
  confirmationIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  confirmationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  confirmationMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  confirmationButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  confirmationButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 