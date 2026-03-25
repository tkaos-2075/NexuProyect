import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import KeyboardAwareScrollView from '@components/KeyboardAwareScrollView';

interface ProfileEditFormProps {
  editForm: {
    name: string;
    email: string;
    password: string;
    newPassword: string;
  };
  setEditForm: (form: any) => void;
  onSave: () => void;
  onCancel: () => void;
  loading: boolean;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ editForm, setEditForm, onSave, onCancel, loading }) => (
  <KeyboardAwareScrollView style={styles.container}>
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        value={editForm.name}
        onChangeText={text => setEditForm((prev: any) => ({ ...prev, name: text }))}
        placeholder="Nombre"
        autoCapitalize="words"
      />
    </View>
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={editForm.email}
        onChangeText={text => setEditForm((prev: any) => ({ ...prev, email: text }))}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
    </View>
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Contraseña Actual</Text>
      <TextInput
        style={styles.input}
        value={editForm.password}
        onChangeText={text => setEditForm((prev: any) => ({ ...prev, password: text }))}
        placeholder="Ingresa tu contraseña actual (opcional)"
        secureTextEntry
      />
    </View>
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Nueva Contraseña</Text>
      <TextInput
        style={styles.input}
        value={editForm.newPassword}
        onChangeText={text => setEditForm((prev: any) => ({ ...prev, newPassword: text }))}
        placeholder="Dejar en blanco para no cambiar"
        secureTextEntry
      />
    </View>
    
    <View style={styles.buttonContainer}>
      <Button
        mode="outlined"
        onPress={onCancel}
        style={styles.cancelButton}
        labelStyle={styles.cancelButtonText}
      >
        Cancelar
      </Button>
      <Button
        mode="contained"
        onPress={onSave}
        disabled={!editForm.name.trim()}
        style={styles.saveButton}
        labelStyle={styles.saveButtonText}
      >
        Guardar
      </Button>
    </View>
  </KeyboardAwareScrollView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  inputGroup: {
    marginBottom: 20,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
    borderColor: '#d1d5db',
  },
  cancelButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: '#1e40af',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileEditForm; 