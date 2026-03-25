import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import FormTextInput from './FormTextInput';
import DropdownMenu from './DropdownMenu';

interface EatFieldsProps {
  form: any;
  errors: any;
  handleChange: (name: string, value: string) => void;
  deliveryOptions: { value: string; label: string }[];
  typeRestaurantOptions: { value: string; label: string }[];
  typeCoffeeOptions: { value: string; label: string }[];
  deliveryMenuVisible: boolean;
  setDeliveryMenuVisible: (visible: boolean) => void;
  typeCoffeeMenuVisible: boolean;
  setTypeCoffeeMenuVisible: (visible: boolean) => void;
  typeRestaurantMenuVisible: boolean;
  setTypeRestaurantMenuVisible: (visible: boolean) => void;
}

export default function EatFields({
  form,
  errors,
  handleChange,
  deliveryOptions,
  typeRestaurantOptions,
  typeCoffeeOptions,
  deliveryMenuVisible,
  setDeliveryMenuVisible,
  typeCoffeeMenuVisible,
  setTypeCoffeeMenuVisible,
  typeRestaurantMenuVisible,
  setTypeRestaurantMenuVisible
}: EatFieldsProps) {
  const { colors } = useTheme();

  return (
    <>
      {/* Menú (URL) - solo para lugares de comida */}
      <FormTextInput
        label="Menú (URL)"
        value={form.menu}
        onChangeText={value => handleChange('menu', value)}
        error={errors.menu}
        placeholder="https://ejemplo.com/menu"
        keyboardType="url"
      />

      {/* Delivery */}
      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <Text style={[styles.label, { color: colors.onBackground }]}>¿Tiene delivery?</Text>
          <DropdownMenu
            visible={deliveryMenuVisible}
            onDismiss={() => setDeliveryMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setDeliveryMenuVisible(true)}
                style={styles.dropdownButton}
                contentStyle={styles.dropdownButtonContent}
              >
                {form.delivery ? 
                  deliveryOptions.find(opt => opt.value === form.delivery)?.label : 
                  'Selecciona...'
                }
              </Button>
            }
            options={deliveryOptions}
            onSelect={value => handleChange('delivery', value)}
            selectedValue={form.delivery}
          />
        </View>
      </View>

      {/* Tipo de restaurante */}
      {form.subType === 'RESTAURANT' && (
        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={[styles.label, { color: colors.onBackground }]}>Tipo de restaurante</Text>
            <DropdownMenu
              visible={typeRestaurantMenuVisible}
              onDismiss={() => setTypeRestaurantMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setTypeRestaurantMenuVisible(true)}
                  style={styles.dropdownButton}
                  contentStyle={styles.dropdownButtonContent}
                >
                  {form.typeRestaurant ? 
                    typeRestaurantOptions.find(opt => opt.value === form.typeRestaurant)?.label : 
                    'Selecciona...'
                  }
                </Button>
              }
              options={typeRestaurantOptions}
              onSelect={value => handleChange('typeRestaurant', value)}
              selectedValue={form.typeRestaurant}
            />
            {errors.typeRestaurant && <Text style={[styles.errorText, { color: colors.error }]}>{errors.typeRestaurant}</Text>}
          </View>
        </View>
      )}

      {/* Tipo de café */}
      {form.subType === 'COFFEE' && (
        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={[styles.label, { color: colors.onBackground }]}>Tipo de café</Text>
            <DropdownMenu
              visible={typeCoffeeMenuVisible}
              onDismiss={() => setTypeCoffeeMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setTypeCoffeeMenuVisible(true)}
                  style={styles.dropdownButton}
                  contentStyle={styles.dropdownButtonContent}
                >
                  {form.typeCoffee ? 
                    typeCoffeeOptions.find(opt => opt.value === form.typeCoffee)?.label : 
                    'Selecciona...'
                  }
                </Button>
              }
              options={typeCoffeeOptions}
              onSelect={value => handleChange('typeCoffee', value)}
              selectedValue={form.typeCoffee}
            />
            {errors.typeCoffee && <Text style={[styles.errorText, { color: colors.error }]}>{errors.typeCoffee}</Text>}
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