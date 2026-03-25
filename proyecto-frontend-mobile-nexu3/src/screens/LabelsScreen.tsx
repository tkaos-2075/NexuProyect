import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, useWindowDimensions, RefreshControl, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthContext } from '@contexts/AuthContext';
import { useRoleCheck } from '@hooks/useRoleCheck';
import { LabelsResponseDto } from '@interfaces/labels/LabelsResponseDto';
import { LabelsRequestDto } from '@interfaces/labels/LabelsRequestDto';
import { getAllLabels } from '@services/labels/getAllLabels';
import { createLabel } from '@services/labels/createLabel';
import { updateLabel } from '@services/labels/updateLabel';
import { deleteLabel } from '@services/labels/deleteLabel';
import LabelForm from '@components/labels/LabelForm';
import AlertToast from '@components/AlertToast';

export default function LabelsScreen() {
  const navigation = useNavigation();
  const { session } = useAuthContext();
  const { isAdmin, role } = useRoleCheck();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  
  const [labels, setLabels] = useState<LabelsResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<LabelsResponseDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showUnauthorizedToast, setShowUnauthorizedToast] = useState(false);



  useEffect(() => {
    fetchLabels();
  }, []);

  const fetchLabels = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllLabels();
      setLabels(res.data);
    } catch (err) {
      setError('Error al cargar etiquetas');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchLabels();
    } catch (error) {
      console.error('Error al refrescar:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleCreate = async (data: Omit<LabelsRequestDto, 'id'>) => {
    if (!isAdmin) {
      setShowUnauthorizedToast(true);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      await createLabel(data);
      await fetchLabels();
      setShowForm(false);
    } catch (err) {
      setError('Error al crear etiqueta');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (data: Omit<LabelsRequestDto, 'id'>) => {
    if (!isAdmin) {
      setShowUnauthorizedToast(true);
      return;
    }
    if (!editing) return;
    setLoading(true);
    setError(null);
    try {
      await updateLabel(editing.id, data);
      await fetchLabels();
      setEditing(null);
      setShowForm(false);
    } catch (err) {
      setError('Error al editar etiqueta');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!isAdmin) {
      setShowUnauthorizedToast(true);
      return;
    }
    
    Alert.alert(
      'Eliminar Etiqueta',
      '¿Estás seguro de que quieres eliminar esta etiqueta? Esta acción no se puede deshacer.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            setError(null);
            try {
              await deleteLabel(id);
              await fetchLabels();
            } catch (err) {
              setError('Error al eliminar etiqueta');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleCreateClick = () => {
    if (!isAdmin) {
      setShowUnauthorizedToast(true);
      return;
    }
    
    setShowForm(true);
  };

  const handleEditClick = (label: LabelsResponseDto) => {
    if (!isAdmin) {
      setShowUnauthorizedToast(true);
      return;
    }
    setEditing(label);
    setShowForm(true);
  };

  const handleFormSubmit = async (data: Omit<LabelsRequestDto, 'id'>) => {
    if (editing) {
      await handleEdit(data);
    } else {
      await handleCreate(data);
    }
  };

  const renderLabelCard = (label: LabelsResponseDto) => (
    <View key={label.id} style={styles.labelCard}>
      {/* Header de la tarjeta */}
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle}>
            {label.name}
          </Text>
          <View style={[
            styles.statusBadge,
            label.status === 'ACTIVE' ? styles.activeBadge : styles.inactiveBadge
          ]}>
            <Text style={[
              styles.statusText,
              { color: label.status === 'ACTIVE' ? '#047857' : '#6b7280' }
            ]}>
              {label.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
            </Text>
          </View>
        </View>
        
        <Text style={styles.cardDescription}>
          {label.description}
        </Text>
      </View>

      {/* Color y acciones */}
      <View style={styles.cardFooter}>
        <View style={styles.colorSection}>
          <View style={[
            styles.colorCircle,
            { backgroundColor: label.color || '#6b7280' }
          ]} />
          <Text style={styles.colorText}>
            {label.color || '#6b7280'}
          </Text>
        </View>
        
        {/* Solo mostrar botones de acción si es admin */}
        {isAdmin && (
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleEditClick(label)}
            >
              <Text style={styles.actionButtonText}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleDelete(label.id)}
            >
              <Text style={styles.actionButtonText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e40af" />
        <Text style={styles.loadingText}>
          Cargando etiquetas...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Etiquetas</Text>
        {!showForm && !editing && isAdmin && (
          <TouchableOpacity 
            style={styles.createButton}
            onPress={handleCreateClick}
          >
            <Text style={styles.createButtonText}>+ Nueva</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Formulario */}
      {showForm && (
        <View style={styles.formContainer}>
          <LabelForm 
            initialData={editing ? {
              name: editing.name,
              description: editing.description,
              color: editing.color,
              status: editing.status || 'ACTIVE',
            } : undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditing(null);
            }}
            submitText={editing ? 'Actualizar' : 'Crear Etiqueta'}
            isLoading={loading}
          />
        </View>
      )}

      {/* Contenido principal */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          isMobile && styles.scrollContentMobile
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#1e40af"
          />
        }
      >
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {error}
            </Text>
          </View>
        )}
        
        <View style={styles.labelsContainer}>
          {labels.length > 0 ? (
            labels.map(renderLabelCard)
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🏷️</Text>
              <Text style={styles.emptyTitle}>
                No hay etiquetas
              </Text>
              <Text style={styles.emptyText}>
                {isAdmin ? 'Crea tu primera etiqueta para organizar lugares' : 'No hay etiquetas disponibles'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {showUnauthorizedToast && (
        <AlertToast
          message="Solo los administradores pueden gestionar etiquetas"
          onClose={() => setShowUnauthorizedToast(false)}
          duration={3000}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  createButton: {
    backgroundColor: '#1e40af',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  createButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    minHeight: 400, // Altura mínima para el formulario
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  scrollContentMobile: {
    padding: 16,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
    color: '#64748b',
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#dc2626',
    textAlign: 'center',
  },
  labelsContainer: {
    gap: 12,
  },
  labelCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: '#d1fae5',
  },
  inactiveBadge: {
    backgroundColor: '#e5e7eb',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  colorSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  colorText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionButtonText: {
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
    color: '#9ca3af',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
  },
}); 