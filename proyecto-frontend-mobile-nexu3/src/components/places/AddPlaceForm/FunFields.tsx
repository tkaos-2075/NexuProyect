import React, { useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import FormTextInput from './FormTextInput';
import DropdownMenu from './DropdownMenu';

interface FunFieldsProps {
  form: any;
  errors: any;
  handleChange: (name: string, value: string) => void;
  sizeParkOptions: { value: string; label: string }[];
  haveGamesOptions: { value: string; label: string }[];
  haveGamesMenuVisible: boolean;
  setHaveGamesMenuVisible: (visible: boolean) => void;
  sizeParkMenuVisible: boolean;
  setSizeParkMenuVisible: (visible: boolean) => void;
  forceHaveGames?: boolean;
}

export default function FunFields({
  form,
  errors,
  handleChange,
  sizeParkOptions,
  haveGamesOptions,
  haveGamesMenuVisible,
  setHaveGamesMenuVisible,
  sizeParkMenuVisible,
  setSizeParkMenuVisible,
  forceHaveGames = false
}: FunFieldsProps) {
  const { colors } = useTheme();

  // Forzar haveGames a 'YES' si es GAMES
  useEffect(() => {
    if (forceHaveGames && form.haveGames !== 'YES') {
      handleChange('haveGames', 'YES');
    }
  }, [forceHaveGames, form.haveGames, handleChange]);

  return (
    <>
      {/* ¿Tiene juegos? - solo para PARKS */}
      {form.subType === 'PARK' && (
        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={[styles.label, { color: colors.onBackground }]}>¿Tiene juegos?</Text>
            <DropdownMenu
              visible={haveGamesMenuVisible}
              onDismiss={() => setHaveGamesMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setHaveGamesMenuVisible(true)}
                  style={styles.dropdownButton}
                  contentStyle={styles.dropdownButtonContent}
                >
                  {form.haveGames ? 
                    haveGamesOptions.find(opt => opt.value === form.haveGames)?.label : 
                    'Selecciona...'
                  }
                </Button>
              }
              options={haveGamesOptions}
              onSelect={value => handleChange('haveGames', value)}
              selectedValue={form.haveGames}
            />
            {errors.haveGames && <Text style={[styles.errorText, { color: colors.error }]}>{errors.haveGames}</Text>}
          </View>
        </View>
      )}

      {/* Juegos - para PARKS con juegos o GAMES */}
      {((form.subType === 'PARK' && form.haveGames === 'YES') || form.subType === 'GAMES') && (
        <FormTextInput
          label="Juegos"
          value={form.games}
          onChangeText={value => handleChange('games', value)}
          error={errors.games}
          placeholder="Juegos disponibles (separados por comas)"
        />
      )}

      {/* Tamaño del parque - solo para PARKS */}
      {form.subType === 'PARK' && (
        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={[styles.label, { color: colors.onBackground }]}>Tamaño del parque</Text>
            <DropdownMenu
              visible={sizeParkMenuVisible}
              onDismiss={() => setSizeParkMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setSizeParkMenuVisible(true)}
                  style={styles.dropdownButton}
                  contentStyle={styles.dropdownButtonContent}
                >
                  {form.sizePark ? 
                    sizeParkOptions.find(opt => opt.value === form.sizePark)?.label : 
                    'Selecciona...'
                  }
                </Button>
              }
              options={sizeParkOptions}
              onSelect={value => handleChange('sizePark', value)}
              selectedValue={form.sizePark}
            />
            {errors.sizePark && <Text style={[styles.errorText, { color: colors.error }]}>{errors.sizePark}</Text>}
          </View>
        </View>
      )}

      {/* Precio por ficha - solo para GAMES */}
      {form.subType === 'GAMES' && (
        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={[styles.label, { color: colors.onBackground }]}>Precio por ficha</Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.surface, color: colors.onSurface, borderColor: errors.priceFicha ? colors.error : colors.outline }]}
              value={form.priceFicha}
              onChangeText={value => handleChange('priceFicha', value)}
              placeholder="2.50"
              keyboardType="numeric"
            />
            {errors.priceFicha && <Text style={[styles.errorText, { color: colors.error }]}>{errors.priceFicha}</Text>}
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
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