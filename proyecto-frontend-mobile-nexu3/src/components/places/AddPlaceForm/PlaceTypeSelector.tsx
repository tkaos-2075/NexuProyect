import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import DropdownMenu from './DropdownMenu';

interface PlaceTypeSelectorProps {
  value: string;
  onChange: (name: string, value: string) => void;
  placeTypeMenuVisible: boolean;
  setPlaceTypeMenuVisible: (visible: boolean) => void;
  subTypeMenuVisible: boolean;
  setSubTypeMenuVisible: (visible: boolean) => void;
  errors: any;
}

export default function PlaceTypeSelector({
  value,
  onChange,
  placeTypeMenuVisible,
  setPlaceTypeMenuVisible,
  subTypeMenuVisible,
  setSubTypeMenuVisible,
  errors
}: PlaceTypeSelectorProps) {
  const { colors } = useTheme();

  const placeTypeOptions = [
    { value: 'eat', label: '🍽️ Lugar para comer' },
    { value: 'fun', label: '🎮 Lugar para divertirse' },
  ];

  const getSubTypeOptions = (placeType: string) => {
    if (placeType === 'eat') {
      return [
        { value: 'COFFEE', label: '☕ Café' },
        { value: 'RESTAURANT', label: '🍲 Restaurante' },
      ];
    } else if (placeType === 'fun') {
      return [
        { value: 'PARK', label: '🌳 Parque' },
        { value: 'GAMES', label: '🎮 Arcade/Juegos' },
      ];
    }
    return [];
  };

  return (
    <>
      {/* Tipo principal */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>¿Qué tipo de lugar quieres agregar?</Text>
        <DropdownMenu
          visible={placeTypeMenuVisible}
          onDismiss={() => setPlaceTypeMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setPlaceTypeMenuVisible(true)}
              style={styles.dropdownButton}
              contentStyle={styles.dropdownButtonContent}
            >
              {value ? 
                (value === 'eat' ? '🍽️ Lugar para comer' : '🎮 Lugar para divertirse') : 
                'Selecciona el tipo de lugar'
              }
            </Button>
          }
          options={placeTypeOptions}
          onSelect={value => onChange('placeType', value)}
          selectedValue={value}
        />
        {errors.placeType && <Text style={[styles.errorText, { color: colors.error }]}>{errors.placeType}</Text>}
      </View>

      {/* Subtipo según selección */}
      {value && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>
            ¿Qué tipo de lugar para {value === 'eat' ? 'comer' : 'divertirse'}?
          </Text>
          <DropdownMenu
            visible={subTypeMenuVisible}
            onDismiss={() => setSubTypeMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setSubTypeMenuVisible(true)}
                style={styles.dropdownButton}
                contentStyle={styles.dropdownButtonContent}
              >
                {getSubTypeOptions(value).find(opt => opt.value === value)?.label || 'Selecciona el subtipo'}
              </Button>
            }
            options={getSubTypeOptions(value)}
            onSelect={value => {
              onChange('subType', value);
              if (value === 'eat') {
                onChange('placeCategoryToEat', value);
              } else if (value === 'fun') {
                onChange('placeCategoryToFun', value);
              }
            }}
            selectedValue={value}
          />
          {errors.subType && <Text style={[styles.errorText, { color: colors.error }]}>{errors.subType}</Text>}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  dropdownButton: {
    borderWidth: 1,
    borderRadius: 8,
  },
  dropdownButtonContent: {
    paddingVertical: 8,
  },
}); 