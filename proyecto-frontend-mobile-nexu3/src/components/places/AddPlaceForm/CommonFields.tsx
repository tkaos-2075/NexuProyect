import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import FormTextInput from './FormTextInput';
import DropdownMenu from './DropdownMenu';

interface CommonFieldsProps {
  form: any;
  errors: any;
  handleChange: (name: string, value: string) => void;
  statusOptions: { value: string; label: string }[];
  wifiOptions: { value: string; label: string }[];
  priceRangeOptions: { value: string; label: string }[];
  hidePriceFields?: boolean;
  statusMenuVisible: boolean;
  setStatusMenuVisible: (visible: boolean) => void;
  wifiMenuVisible: boolean;
  setWifiMenuVisible: (visible: boolean) => void;
  priceRangeMenuVisible: boolean;
  setPriceRangeMenuVisible: (visible: boolean) => void;
  paymentMenuVisible: boolean;
  setPaymentMenuVisible: (visible: boolean) => void;
  paymentOptions: { value: string; label: string }[];
}

const RequiredMark = () => <Text style={{ color: '#ef4444' }}>*</Text>;

export default function CommonFields({
  form,
  errors,
  handleChange,
  statusOptions,
  wifiOptions,
  priceRangeOptions,
  hidePriceFields = false,
  statusMenuVisible,
  setStatusMenuVisible,
  wifiMenuVisible,
  setWifiMenuVisible,
  priceRangeMenuVisible,
  setPriceRangeMenuVisible,
  paymentMenuVisible,
  setPaymentMenuVisible,
  paymentOptions
}: CommonFieldsProps) {
  const { colors } = useTheme();

  return (
    <>
      {/* Nombre */}
      <FormTextInput
        label="Nombre *"
        value={form.name}
        onChangeText={value => handleChange('name', value)}
        error={errors.name}
        placeholder="Nombre del lugar"
      />

      {/* Dirección */}
      <FormTextInput
        label="Dirección *"
        value={form.address}
        onChangeText={value => handleChange('address', value)}
        error={errors.address}
        placeholder="Dirección del lugar"
      />

      {/* Campos de hora para todos los tipos de lugar */}
      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <Text style={[styles.label, { color: colors.onBackground }]}>Hora de apertura <RequiredMark /></Text>
          <TextInput
            style={[styles.textInput, { backgroundColor: colors.surface, color: colors.onSurface, borderColor: errors.openTime ? colors.error : colors.outline }]}
            value={form.openTime}
            onChangeText={value => handleChange('openTime', value)}
            placeholder="08:00"
            keyboardType="default"
          />
          {errors.openTime && <Text style={[styles.errorText, { color: colors.error }]}>{errors.openTime}</Text>}
        </View>
        <View style={styles.halfWidth}>
          <Text style={[styles.label, { color: colors.onBackground }]}>Hora de cierre <RequiredMark /></Text>
          <TextInput
            style={[styles.textInput, { backgroundColor: colors.surface, color: colors.onSurface, borderColor: errors.closeTime ? colors.error : colors.outline }]}
            value={form.closeTime}
            onChangeText={value => handleChange('closeTime', value)}
            placeholder="22:00"
            keyboardType="default"
          />
          {errors.closeTime && <Text style={[styles.errorText, { color: colors.error }]}>{errors.closeTime}</Text>}
        </View>
      </View>

      {/* Descripción */}
      <FormTextInput
        label="Descripción *"
        value={form.description}
        onChangeText={value => handleChange('description', value)}
        error={errors.description}
        placeholder="Describe el lugar..."
        multiline
        numberOfLines={3}
      />

      {/* Capacidad y Estado */}
      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <Text style={[styles.label, { color: colors.onBackground }]}>Capacidad <RequiredMark /></Text>
          <TextInput
            style={[styles.textInput, { backgroundColor: colors.surface, color: colors.onSurface, borderColor: errors.capacity ? colors.error : colors.outline }]}
            value={form.capacity}
            onChangeText={value => handleChange('capacity', value)}
            placeholder="50"
            keyboardType="numeric"
          />
          {errors.capacity && <Text style={[styles.errorText, { color: colors.error }]}>{errors.capacity}</Text>}
        </View>
        <View style={styles.halfWidth}>
          <Text style={[styles.label, { color: colors.onBackground }]}>Estado <RequiredMark /></Text>
          <DropdownMenu
            visible={statusMenuVisible}
            onDismiss={() => setStatusMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setStatusMenuVisible(true)}
                style={styles.dropdownButton}
                contentStyle={styles.dropdownButtonContent}
              >
                {form.status ? 
                  statusOptions.find(opt => opt.value === form.status)?.label : 
                  'Selecciona...'
                }
              </Button>
            }
            options={statusOptions}
            onSelect={value => handleChange('status', value)}
            selectedValue={form.status}
          />
          {errors.status && <Text style={[styles.errorText, { color: colors.error }]}>{errors.status}</Text>}
        </View>
      </View>

      {/* Wifi */}
      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <Text style={[styles.label, { color: colors.onBackground }]}>Wifi</Text>
          <DropdownMenu
            visible={wifiMenuVisible}
            onDismiss={() => setWifiMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setWifiMenuVisible(true)}
                style={styles.dropdownButton}
                contentStyle={styles.dropdownButtonContent}
              >
                {form.wifi ? 
                  wifiOptions.find(opt => opt.value === form.wifi)?.label : 
                  'Selecciona...'
                }
              </Button>
            }
            options={wifiOptions}
            onSelect={value => handleChange('wifi', value)}
            selectedValue={form.wifi}
          />
        </View>
      </View>

      {/* Método de pago */}
      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <Text style={[styles.label, { color: colors.onBackground }]}>Método de pago <RequiredMark /></Text>
          <DropdownMenu
            visible={paymentMenuVisible}
            onDismiss={() => setPaymentMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setPaymentMenuVisible(true)}
                style={styles.dropdownButton}
                contentStyle={styles.dropdownButtonContent}
              >
                {form.payment ? 
                  paymentOptions.find(opt => opt.value === form.payment)?.label : 
                  'Selecciona...'
                }
              </Button>
            }
            options={paymentOptions}
            onSelect={value => handleChange('payment', value)}
            selectedValue={form.payment}
          />
          {errors.payment && <Text style={[styles.errorText, { color: colors.error }]}>{errors.payment}</Text>}
        </View>
      </View>

      {/* Rango de precios y precio estimado (solo si no es gratis) */}
      {!hidePriceFields && (
        <>
          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Text style={[styles.label, { color: colors.onBackground }]}>Rango de precios</Text>
              <DropdownMenu
                visible={priceRangeMenuVisible}
                onDismiss={() => setPriceRangeMenuVisible(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setPriceRangeMenuVisible(true)}
                    style={styles.dropdownButton}
                    contentStyle={styles.dropdownButtonContent}
                  >
                    {form.priceRange ? 
                      priceRangeOptions.find(opt => opt.value === form.priceRange)?.label : 
                      'Selecciona...'
                    }
                  </Button>
                }
                options={priceRangeOptions}
                onSelect={value => handleChange('priceRange', value)}
                selectedValue={form.priceRange}
              />
            </View>
            <View style={styles.halfWidth}>
              <Text style={[styles.label, { color: colors.onBackground }]}>Precio estimado</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.surface, color: colors.onSurface, borderColor: errors.estimatedPrice ? colors.error : colors.outline }]}
                value={form.estimatedPrice}
                onChangeText={value => handleChange('estimatedPrice', value)}
                placeholder="25.00"
                keyboardType="numeric"
              />
              {errors.estimatedPrice && <Text style={[styles.errorText, { color: colors.error }]}>{errors.estimatedPrice}</Text>}
            </View>
          </View>
        </>
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