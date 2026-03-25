import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { User } from './types';

interface UserSelectorProps {
  selectedUsers: User[];
  onPress: () => void;
}

export default function UserSelector({ 
  selectedUsers, 
  onPress 
}: UserSelectorProps) {
  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.label]}>Participantes ({selectedUsers.length} seleccionados)</Text>
      <TouchableOpacity
        style={[
          styles.addUsersButton,
          { backgroundColor: '#3b82f6' }
        ]}
        onPress={onPress}
      >
        <Text style={styles.addUsersButtonText}>👥 Agregar Usuarios</Text>
      </TouchableOpacity>
      {selectedUsers.length > 0 && (
        <View style={styles.selectedUsersContainer}>
          {selectedUsers.map((user) => (
            <View key={user.id} style={[
              styles.userTag,
              { backgroundColor: '#dbeafe' }
            ]}>
              <Text style={[styles.userTagText]}>{user.name}</Text>
            </View>
          ))}
        </View>
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
  addUsersButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addUsersButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  selectedUsersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  userTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  userTagText: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 