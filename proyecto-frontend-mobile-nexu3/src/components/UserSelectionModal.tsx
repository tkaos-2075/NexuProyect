import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, FlatList, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import { getAllUsers } from '@services/users/getAllUsers';
import { Surface, Button, ActivityIndicator } from 'react-native-paper';

interface User {
  id: number;
  name: string;
  email: string;
  username?: string;
  role: string;
}

interface UserSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedUserIds: number[]) => void;
  initialSelectedIds?: number[];
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function UserSelectionModal({
  isOpen,
  onClose,
  onConfirm,
  initialSelectedIds = []
}: UserSelectionModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>(initialSelectedIds);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setError('');
      (async () => {
        try {
          const res = await getAllUsers();
          setUsers(res.data || []);
        } catch (e) {
          setError('Error al cargar usuarios');
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [isOpen]);

  const filteredUsers = users.filter(
    user =>
      user.role === 'USER' &&
      (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleUserToggle = (userId: number) => {
    setSelectedUserIds(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleConfirm = () => {
    onConfirm(selectedUserIds);
    onClose();
  };

  return (
    <Modal visible={isOpen} transparent animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.overlay}>
        <Surface style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                Seleccionar Participantes
              </Text>
              <Text style={styles.subtitle}>
                {selectedUserIds.length} usuario{selectedUserIds.length !== 1 ? 's' : ''} seleccionado{selectedUserIds.length !== 1 ? 's' : ''}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Buscador */}
          <View style={styles.searchRow}>
            <TextInput
              style={styles.input}
              placeholder="Buscar usuarios por nombre o email..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Lista de usuarios */}
          <View style={styles.listContainer}>
            {isLoading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="large" color="#2563eb" />
                <Text style={styles.loadingText}>Cargando usuarios...</Text>
              </View>
            ) : error ? (
              <View style={styles.emptyRow}>
                <Text style={styles.emptyText}>{error}</Text>
              </View>
            ) : filteredUsers.length === 0 ? (
              <View style={styles.emptyRow}>
                <Text style={styles.emptyText}>
                  {searchQuery ? "No se encontraron usuarios que coincidan con la búsqueda" : "No hay usuarios disponibles"}
                </Text>
              </View>
            ) : (
              <FlatList
                data={filteredUsers}
                keyExtractor={item => item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.userRow, selectedUserIds.includes(item.id) && styles.userRowSelected]}
                    onPress={() => handleUserToggle(item.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
                    </View>
                    <View style={styles.userInfo}>
                      <Text style={styles.userName}>{item.name}</Text>
                      <Text style={styles.userEmail}>{item.email}</Text>
                      {item.username && (
                        <Text style={styles.userUsername}>@{item.username}</Text>
                      )}
                    </View>
                    <View style={[styles.checkbox, selectedUserIds.includes(item.id) && styles.checkboxSelected]}>
                      {selectedUserIds.includes(item.id) && (
                        <Text style={styles.checkboxCheck}>✓</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Button 
              mode="outlined" 
              style={styles.cancelBtn} 
              onPress={onClose}
              labelStyle={styles.cancelBtnText}
            >
              Cancelar
            </Button>
            <Button 
              mode="contained" 
              style={styles.confirmBtn} 
              onPress={handleConfirm}
              labelStyle={styles.confirmBtnText}
            >
              Confirmar ({selectedUserIds.length})
            </Button>
          </View>
        </Surface>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    maxWidth: screenWidth > 768 ? 600 : screenWidth - 40,
    maxHeight: screenHeight * 0.85,
    minHeight: screenHeight * 0.6,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#f8fafc',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    fontSize: 20,
    color: '#6b7280',
    fontWeight: 'bold',
  },
  searchRow: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f9fafb',
    color: '#1f2937',
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginLeft: 12,
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '500',
  },
  emptyRow: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    color: '#6b7280',
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  userRowSelected: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
    borderWidth: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: '600',
    color: '#111827',
    fontSize: 16,
    marginBottom: 2,
  },
  userEmail: {
    color: '#6b7280',
    fontSize: 14,
    marginBottom: 2,
  },
  userUsername: {
    color: '#9ca3af',
    fontSize: 13,
    fontStyle: 'italic',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    backgroundColor: '#fff',
  },
  checkboxSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  checkboxCheck: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#f8fafc',
  },
  cancelBtn: {
    borderColor: '#d1d5db',
    borderRadius: 12,
    minWidth: 120,
  },
  cancelBtnText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmBtn: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    minWidth: 160,
  },
  confirmBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 