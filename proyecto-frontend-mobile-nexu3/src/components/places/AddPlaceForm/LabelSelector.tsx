import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { LabelsResponseDto } from '@interfaces/labels/LabelsResponseDto';

interface LabelSelectorProps {
  labels: LabelsResponseDto[];
  selected: number[];
  onSelect: (id: number) => void;
  loading: boolean;
  error?: string;
}

export default function LabelSelector({ labels, selected, onSelect, loading, error }: LabelSelectorProps) {
  const [showModal, setShowModal] = useState(false);

  const renderLabelItem = ({ item }: { item: LabelsResponseDto }) => (
    <TouchableOpacity
      style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, marginBottom: 8, backgroundColor: selected.includes(item.id) ? '#dbeafe' : '#fff' }}
      onPress={() => onSelect(item.id)}
    >
      <View style={{ width: 16, height: 16, borderRadius: 8, marginRight: 12, backgroundColor: item.color }} />
      <Text style={{ fontSize: 16, color: selected.includes(item.id) ? '#1e40af' : '#111827', fontWeight: selected.includes(item.id) ? '600' : '400' }}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontWeight: '600', marginBottom: 4 }}>Etiquetas</Text>
      <TouchableOpacity
        style={{ backgroundColor: '#3b82f6', padding: 10, borderRadius: 8, alignItems: 'center', marginBottom: 4 }}
        onPress={() => setShowModal(true)}
      >
        <Text style={{ color: '#fff' }}>{loading ? 'Cargando...' : 'Seleccionar etiquetas'}</Text>
      </TouchableOpacity>
      {selected.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
          {labels.filter(label => selected.includes(label.id)).map(label => (
            <View key={label.id} style={{ backgroundColor: label.color, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4, marginRight: 4, marginBottom: 4 }}>
              <Text style={{ color: '#fff', fontSize: 13 }}>{label.name}</Text>
            </View>
          ))}
        </View>
      )}
      {error && <Text style={{ color: '#ef4444', fontSize: 13 }}>{error}</Text>}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, width: '100%', maxWidth: 400, maxHeight: '80%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827' }}>Seleccionar Etiquetas</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text style={{ fontSize: 20, color: '#9ca3af', fontWeight: 'bold' }}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={labels}
              renderItem={renderLabelItem}
              keyExtractor={item => item.id.toString()}
              style={{ padding: 20 }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
} 