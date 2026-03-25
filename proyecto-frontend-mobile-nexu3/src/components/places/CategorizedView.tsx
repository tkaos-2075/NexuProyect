import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { PlacesToEatResponseDto } from '@interfaces/placesToEat/PlacesToEatResponseDto';
import { PlacesToFunResponseDto } from '@interfaces/placesToFun/PlacesToFunResponseDto';
import PlaceCard from './PlaceCard';

interface CategorizedViewProps {
  places: (PlacesToEatResponseDto | PlacesToFunResponseDto)[];
}

interface CategorySection {
  name: string;
  emoji: string;
  places: (PlacesToEatResponseDto | PlacesToFunResponseDto)[];
  color: string;
}

export default function CategorizedView({ places }: CategorizedViewProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Organiza los lugares por categoría
  const categorizedPlaces = useMemo(() => {
    const categories: { [key: string]: (PlacesToEatResponseDto | PlacesToFunResponseDto)[] } = {};
    places.forEach(place => {
      const category = 'placeCategoryToEat' in place 
        ? place.placeCategoryToEat 
        : place.placeCategoryToFun;
      if (!categories[category]) categories[category] = [];
      categories[category].push(place);
    });
    return categories;
  }, [places]);

  // Configuración visual de cada categoría
  const categoryConfig: { [key: string]: { emoji: string; color: string } } = {
    'RESTAURANT': { emoji: '🍽️', color: '#fee2e2' },
    'CAFE': { emoji: '☕', color: '#fef3c7' },
    'BAR': { emoji: '🍺', color: '#dbeafe' },
    'PARK': { emoji: '🌳', color: '#bbf7d0' },
    'ARCADE': { emoji: '🎮', color: '#ede9fe' },
    'CLUB': { emoji: '🎉', color: '#fce7f3' },
  };

  // Secciones de categoría para renderizar
  const categorySections = useMemo(() => {
    return Object.entries(categorizedPlaces)
      .map(([category, places]) => ({
        name: category,
        emoji: categoryConfig[category]?.emoji || '📍',
        places,
        color: categoryConfig[category]?.color || '#f3f4f6'
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [categorizedPlaces]);

  // Expansión/colapso de categorías
  const toggleCategory = (categoryName: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryName)) newExpanded.delete(categoryName);
    else newExpanded.add(categoryName);
    setExpandedCategories(newExpanded);
  };
  const expandAll = () => setExpandedCategories(new Set(categorySections.map(cat => cat.name)));
  const collapseAll = () => setExpandedCategories(new Set());
  const isExpanded = (categoryName: string) => expandedCategories.has(categoryName);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Controles de expansión global */}
      <View style={styles.controlsRow}>
        <Text style={styles.controlsInfo}>{categorySections.length} categorías • {places.length} lugares</Text>
        <View style={styles.controlsButtons}>
          <TouchableOpacity style={styles.expandButton} onPress={expandAll}>
            <Text style={styles.expandButtonText}>Expandir todo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.collapseButton} onPress={collapseAll}>
            <Text style={styles.collapseButtonText}>Colapsar todo</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Renderizado de cada sección de categoría */}
      {categorySections.map((section) => (
        <View key={section.name} style={[styles.categoryBox, { backgroundColor: section.color }]}> 
          {/* Header de la categoría */}
          <TouchableOpacity style={styles.categoryHeader} onPress={() => toggleCategory(section.name)}>
            <View style={styles.categoryHeaderLeft}>
              <Text style={styles.categoryEmoji}>{section.emoji}</Text>
              <View>
                <Text style={styles.categoryTitle}>{section.name}</Text>
                <Text style={styles.categorySubtitle}>{section.places.length} lugar{section.places.length !== 1 ? 'es' : ''}</Text>
              </View>
            </View>
            <View style={styles.categoryHeaderRight}>
              <Text style={styles.toggleText}>{isExpanded(section.name) ? 'Ocultar' : 'Mostrar'}</Text>
              <Text style={[styles.toggleArrow, isExpanded(section.name) && styles.toggleArrowOpen]}>▼</Text>
            </View>
          </TouchableOpacity>
          {/* Contenido de la categoría */}
          {isExpanded(section.name) && (
            <View style={styles.categoryContent}>
              <View style={styles.cardsGrid}>
                {section.places.map(place => (
                  <View key={place.id} style={styles.cardWrapper}>
                    <PlaceCard place={place} compact={true} />
                  </View>
                ))}
              </View>
              {/* Estadísticas de la categoría */}
              <View style={styles.statsRow}>
                <Text style={styles.statsText}>
                  Promedio de calificación: {
                    section.places.length > 0 
                      ? (section.places.reduce((sum, place) => sum + (place.qualification || 0), 0) / section.places.length).toFixed(1)
                      : 'N/A'
                  } ⭐
                </Text>
                <Text style={styles.statsText}>
                  {section.places.filter(p => p.status.toLowerCase() === 'abierto' || p.status.toLowerCase() === 'open').length} abierto{section.places.filter(p => p.status.toLowerCase() === 'abierto' || p.status.toLowerCase() === 'open').length !== 1 ? 's' : ''}
                </Text>
              </View>
            </View>
          )}
        </View>
      ))}
      {/* Mensaje si no hay categorías */}
      {categorySections.length === 0 && (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyIcon}>📂</Text>
          <Text style={styles.emptyTitle}>No hay categorías disponibles</Text>
          <Text style={styles.emptyText}>Los lugares no se han categorizado aún</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
    gap: 12,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  controlsInfo: {
    color: '#64748b',
    fontSize: 13,
  },
  controlsButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  expandButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 4,
  },
  expandButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  collapseButton: {
    backgroundColor: '#6b7280',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  collapseButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  categoryBox: {
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  categoryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  categoryEmoji: {
    fontSize: 26,
    marginRight: 8,
  },
  categoryTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
  },
  categorySubtitle: {
    fontSize: 13,
    color: '#64748b',
  },
  categoryHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  toggleText: {
    color: '#64748b',
    fontSize: 13,
    marginRight: 2,
  },
  toggleArrow: {
    fontSize: 18,
    color: '#64748b',
  },
  toggleArrowOpen: {
    transform: [{ rotate: '180deg' }],
  },
  categoryContent: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    padding: 12,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cardWrapper: {
    flexBasis: '48%',
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 8,
  },
  statsText: {
    color: '#64748b',
    fontSize: 13,
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyIcon: {
    fontSize: 38,
    marginBottom: 6,
    color: '#64748b',
  },
  emptyTitle: {
    color: '#111827',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 2,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 14,
  },
}); 