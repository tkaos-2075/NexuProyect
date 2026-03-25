import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { UsersResponseDto } from '@interfaces/user/UsersResponseDto';

interface ProfileInfoProps {
  user: UsersResponseDto;
  isEditing: boolean;
  onEdit: () => void;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ user, isEditing, onEdit, getStatusColor, getStatusText }) => (
  <View style={styles.card}>
    <View style={styles.headerRow}>
      <Text style={styles.title}>Información Personal</Text>
      {!isEditing && (
        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
      )}
    </View>
    <View style={styles.infoGrid}>
      <View style={styles.infoItem}>
        <Text style={styles.label}>Estado</Text>
        <Text style={[styles.status, { backgroundColor: getStatusColor(user.status) }]}>
          {getStatusText(user.status)}
        </Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.label}>Nombre</Text>
        <Text style={styles.value}>{user.name}</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user.email}</Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 18,
    padding: 18,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  editButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  infoItem: {
    flexBasis: '48%',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  value: {
    color: '#111827',
    fontSize: 15,
  },
  status: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginTop: 2,
    overflow: 'hidden',
  },
});

export default ProfileInfo; 