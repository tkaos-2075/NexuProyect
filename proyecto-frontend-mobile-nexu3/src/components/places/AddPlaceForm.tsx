import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Alert, 
  ActivityIndicator,
  Modal,
  FlatList
} from 'react-native';
import { 
  Menu, 
  Button, 
  Divider,
  List,
  Chip,
  useTheme
} from 'react-native-paper';
import { createPlaceToEat } from "@services/placesToEat/createPlaceToEat";
import { createPlaceToFun } from "@services/placesToFun/createPlaceToFun";
import SimpleToast from '../SimpleToast';
import AlertToast from '../AlertToast';
import AddPlaceHeader from './AddPlaceForm/AddPlaceHeader';
import SaveButton from './AddPlaceForm/SaveButton';
import { useNavigation } from '@react-navigation/native';
import FormTextInput from './AddPlaceForm/FormTextInput';
import { getRoleBasedOnToken } from '@utils/getRoleBasedOnToken';
import CommonFields from './AddPlaceForm/CommonFields';
import EatFields from './AddPlaceForm/EatFields';
import FunFields from './AddPlaceForm/FunFields';
import PlaceTypeSelector from './AddPlaceForm/PlaceTypeSelector';

const tipoLugarOpciones = [
  { value: 'COFFEE', label: '☕ Café' },
  { value: 'RESTAURANT', label: '🍽️ Restaurante' },
  { value: 'PARK', label: '🌳 Parque' },
  { value: 'GAMES', label: '🕹️ Arcade' },
];

interface AddPlaceFormProps {
  onClose?: () => void;
  lat?: number;
  lng?: number;
  onPlaceCreated?: () => void;
}

// Utilidades para validaciones
const isValidLat = (lat: string) => /^-?([1-8]?\d(\.\d+)?|90(\.0+)?)$/.test(lat);
const isValidLng = (lng: string) => /^-?((1[0-7]\d)|(\d{1,2}))(\.\d+)?|180(\.0+)?$/.test(lng);
const isValidUrl = (url: string) => /^https?:\/\/.+\..+/.test(url);
const isValidTime = (time: string) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);

const initialState = {
  // Comunes
  name: '',
  address: '',
  latitude: '',
  longitude: '',
  payment: '',
  openTime: '',
  closeTime: '',
  description: '',
  wifi: '',
  priceRange: '',
  estimatedPrice: '',
  capacity: '',
  status: '',
  menu: '',
  delivery: '',
  // Específicos
  placeType: '', // eat | fun
  subType: '', // COFFEE, RESTAURANT, PARK, GAMES
  typeCoffee: '',
  typeRestaurant: '',
  placeCategoryToEat: '',
  placeCategoryToFun: '',
  games: '', // Coma separados
  priceFicha: '',
  sizePark: '',
  haveGames: '',
};

// Utilidad para marcar campos obligatorios
const RequiredMark = () => <Text style={{ color: '#ef4444' }}>*</Text>;

export default function AddPlaceForm({ onClose, lat, lng, onPlaceCreated }: AddPlaceFormProps) {
  const navigation = useNavigation();
  const { colors, dark } = useTheme();
  const [form, setForm] = useState({
    ...initialState,
    latitude: lat !== undefined ? String(lat) : '',
    longitude: lng !== undefined ? String(lng) : '',
  });
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' as 'success' | 'error' });
  const [showUnauthorized, setShowUnauthorized] = useState(false);
  
  // Estados para los menús desplegables
  const [placeTypeMenuVisible, setPlaceTypeMenuVisible] = useState(false);
  const [subTypeMenuVisible, setSubTypeMenuVisible] = useState(false);
  const [paymentMenuVisible, setPaymentMenuVisible] = useState(false);
  const [statusMenuVisible, setStatusMenuVisible] = useState(false);
  const [wifiMenuVisible, setWifiMenuVisible] = useState(false);
  const [priceRangeMenuVisible, setPriceRangeMenuVisible] = useState(false);
  const [deliveryMenuVisible, setDeliveryMenuVisible] = useState(false);
  const [typeCoffeeMenuVisible, setTypeCoffeeMenuVisible] = useState(false);
  const [typeRestaurantMenuVisible, setTypeRestaurantMenuVisible] = useState(false);
  const [sizeParkMenuVisible, setSizeParkMenuVisible] = useState(false);
  const [haveGamesMenuVisible, setHaveGamesMenuVisible] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      try {
        const role = await getRoleBasedOnToken();
        if (role === 'VIEWER') setShowUnauthorized(true);
      } catch {}
    };
    checkRole();
  }, []);

  // Manejo de cambios
  const handleChange = (name: string, value: string) => {
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Componente para menús desplegables
  const DropdownMenu = ({ 
    visible, 
    onDismiss, 
    anchor, 
    options, 
    onSelect, 
    selectedValue,
    placeholder = "Selecciona..."
  }: {
    visible: boolean;
    onDismiss: () => void;
    anchor: React.ReactNode;
    options: { value: string; label: string }[];
    onSelect: (value: string) => void;
    selectedValue: string;
    placeholder?: string;
  }) => (
    <Menu
      visible={visible}
      onDismiss={onDismiss}
      anchor={anchor}
      contentStyle={{ backgroundColor: '#fff' }}
    >
      {options.map((option) => (
        <Menu.Item
          key={option.value}
          onPress={() => {
            onSelect(option.value);
            onDismiss();
          }}
          title={option.label}
          titleStyle={{ 
            color: selectedValue === option.value ? '#3b82f6' : '#111827',
            fontWeight: selectedValue === option.value ? '600' : '400'
          }}
        />
      ))}
    </Menu>
  );

  // Validaciones por campo
  const validate = () => {
    const newErrors: { [k: string]: string } = {};
    
    // Campos obligatorios según el backend
    if (!form.name) newErrors.name = 'El nombre es obligatorio';
    if (!form.address) newErrors.address = 'La dirección es obligatoria';
    if (!form.latitude || !isValidLat(form.latitude)) newErrors.latitude = 'Latitud inválida';
    if (!form.longitude || !isValidLng(form.longitude)) newErrors.longitude = 'Longitud inválida';
    if (!form.payment) newErrors.payment = 'Selecciona un método de pago';
    
    // Campos de hora obligatorios para todos los tipos de lugar
    if (!form.openTime || !isValidTime(form.openTime)) newErrors.openTime = 'Hora inválida (hh:mm)';
    if (!form.closeTime || !isValidTime(form.closeTime)) newErrors.closeTime = 'Hora inválida (hh:mm)';
    
    if (!form.description) newErrors.description = 'La descripción es obligatoria';
    if (!form.capacity || isNaN(Number(form.capacity))) newErrors.capacity = 'Capacidad inválida';
    if (!form.status) newErrors.status = 'Selecciona el estado';
    
    // Campos obligatorios para el tipo de lugar
    if (!form.placeType) newErrors.placeType = 'Selecciona el tipo de lugar';
    if (!form.subType) newErrors.subType = 'Selecciona la subcategoría';
    
    return newErrors;
  };

  const handleSubmit = async () => {
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;
    setIsSubmitting(true);
    try {
      // Mapeo de valores para el backend
      const paymentMap: Record<string, 'FREE' | 'CARD' | 'CASH' | 'YAPE'> = {
        'EFECTIVO': 'CASH',
        'TARJETA': 'CARD',
        'YAPE': 'YAPE',
        'GRATIS': 'FREE',
      };

      const priceRangeMap: Record<string, string> = {
        'ECONOMICO': 'ECONOMICO',
        'MODERADO': 'MODERADO',
        'CARO': 'CARO',
      };

      const statusMap: Record<string, string> = {
        'OPEN': 'OPEN',
        'CLOSED': 'CLOSED',
        'MAINTENANCE': 'MAINTENANCE',
      };

      const sizeParkMap: Record<string, 'BIG' | 'REGULAR' | 'SMALL'> = {
        'PEQUEÑO': 'SMALL',
        'REGULAR': 'REGULAR',
        'GRANDE': 'BIG',
      };

      if (form.placeType === "eat") {
        const payload = {
          name: form.name,
          address: form.address,
          latitude: Number(form.latitude),
          longitude: Number(form.longitude),
          payment: paymentMap[form.payment] || 'FREE',
          openTime: form.openTime,
          closeTime: form.closeTime,
          description: form.description,
          capacity: Number(form.capacity),
          status: statusMap[form.status] || 'OPEN',
          placeCategoryToEat: form.placeCategoryToEat as 'COFFEE' | 'RESTAURANT',
          ...(form.menu && { menu: form.menu }),
          ...(form.wifi && { wifi: form.wifi === 'YES' }),
          ...(form.priceRange && { priceRange: priceRangeMap[form.priceRange] }),
          ...(form.estimatedPrice && { estimatedPrice: Number(form.estimatedPrice) }),
          ...(form.delivery && { delivery: form.delivery === 'YES' }),
          ...(form.typeCoffee && { typeCoffee: form.typeCoffee as 'TRADICIONAL' | 'PETFRIENDLY' | 'VEGANA' }),
          ...(form.typeRestaurant && { typeRestaurant: form.typeRestaurant as 'CRIOLLO' | 'SELVATICO' | 'MARISCO' }),
        };

        console.log('Enviando lugar para comer:', payload);
        await createPlaceToEat(payload);
      } else if (form.placeType === "fun") {
        const payload = {
          name: form.name,
          address: form.address,
          latitude: Number(form.latitude),
          longitude: Number(form.longitude),
          payment: paymentMap[form.payment] || 'FREE',
          openTime: form.openTime,
          closeTime: form.closeTime,
          description: form.description,
          capacity: Number(form.capacity),
          status: statusMap[form.status] || 'OPEN',
          placeCategoryToFun: form.placeCategoryToFun as 'PARK' | 'GAMES',
          ...(form.games && { games: form.games.split(',').map(g => g.trim()) }),
          ...(form.haveGames && { haveGames: form.haveGames === 'YES' }),
          ...(form.sizePark && { sizePark: sizeParkMap[form.sizePark] }),
          ...(form.priceFicha && { priceFicha: Number(form.priceFicha) }),
        };

        console.log('Enviando lugar para diversión:', payload);
        await createPlaceToFun(payload);
      }

      setToast({ message: '¡Lugar agregado correctamente!', type: 'success' });
      
      // Notificar que se creó el lugar y cerrar después de un delay
      if (onPlaceCreated) {
        onPlaceCreated();
      }
      if (onClose) setTimeout(onClose, 1200);
    } catch (error: any) {
      console.error('Error al crear lugar:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      let errorMessage = 'Error al agregar el lugar. Intenta de nuevo.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = 'No tienes permisos para agregar lugares.';
      } else if (error.response?.status === 400) {
        errorMessage = 'Datos inválidos. Revisa la información ingresada.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Error del servidor. Intenta más tarde.';
      }
      
      setToast({ message: errorMessage, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Opciones restauradas
  const priceRangeOptions = [
    { value: 'ECONOMICO', label: '💰 Económico' },
    { value: 'MODERADO', label: '💸 Moderado' },
    { value: 'CARO', label: '💎 Caro' },
  ];
  const wifiOptions = [
    { value: 'YES', label: '✅ Sí' },
    { value: 'NO', label: '❌ No' },
  ];
  const deliveryOptions = [
    { value: 'YES', label: '✅ Sí' },
    { value: 'NO', label: '❌ No' },
  ];
  const haveGamesOptions = [
    { value: 'YES', label: '✅ Sí' },
    { value: 'NO', label: '❌ No' },
  ];
  const typeCoffeeOptions = [
    { value: 'TRADICIONAL', label: '☕ Tradicional' },
    { value: 'PETFRIENDLY', label: '🐕 Pet Friendly' },
    { value: 'VEGANA', label: '🌱 Vegana' },
  ];
  const typeRestaurantOptions = [
    { value: 'CRIOLLO', label: '🍲 Criollo' },
    { value: 'SELVATICO', label: '🌿 Selvático' },
    { value: 'MARISCO', label: '🦐 Marisco' },
  ];
  const sizeParkOptions = [
    { value: 'PEQUEÑO', label: '🟢 Pequeño' },
    { value: 'REGULAR', label: '🟡 Regular' },
    { value: 'GRANDE', label: '🟣 Grande' },
  ];

  // Opciones
  const paymentOptions = [
    { value: 'EFECTIVO', label: '💵 Efectivo' },
    { value: 'TARJETA', label: '💳 Tarjeta' },
    { value: 'YAPE', label: '📱 Yape' },
    { value: 'GRATIS', label: '🆓 Gratis' },
  ];
  const statusOptions = [
    { value: 'OPEN', label: '🟢 Abierto' },
    { value: 'CLOSED', label: '🔴 Cerrado' },
    { value: 'MAINTENANCE', label: '🔧 En mantenimiento' },
  ];


  const handleClose = () => {
    if (navigation.canGoBack()) navigation.goBack();
  };

  if (showUnauthorized) {
    return (
      <AlertToast
        message="No tienes permisos para agregar lugares."
        type="error"
        onClose={onClose ?? (() => { if (navigation.canGoBack()) navigation.goBack(); })}
        duration={4000}
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AddPlaceHeader onClose={handleClose} />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ padding: 16 }}>
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
                  {form.placeType ? 
                    (form.placeType === 'eat' ? '🍽️ Lugar para comer' : '🎮 Lugar para divertirse') : 
                    'Selecciona el tipo de lugar'
                  }
                </Button>
              }
              options={[
                { value: 'eat', label: '🍽️ Lugar para comer' },
                { value: 'fun', label: '🎮 Lugar para divertirse' },
              ]}
              onSelect={value => handleChange('placeType', value)}
              selectedValue={form.placeType}
            />
            {errors.placeType && <Text style={[styles.errorText, { color: colors.error }]}>{errors.placeType}</Text>}
          </View>

          {/* Subtipo según selección */}
          {form.placeType === "eat" && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>¿Qué tipo de lugar para comer?</Text>
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
                    {form.subType ? 
                      tipoLugarOpciones.find(opt => opt.value === form.subType)?.label : 
                      'Selecciona el subtipo'
                    }
                  </Button>
                }
                options={tipoLugarOpciones.filter(opt => opt.value === 'COFFEE' || opt.value === 'RESTAURANT')}
                onSelect={value => {
                  handleChange('subType', value);
                  handleChange('placeCategoryToEat', value);
                }}
                selectedValue={form.subType}
              />
              {errors.subType && <Text style={[styles.errorText, { color: colors.error }]}>{errors.subType}</Text>}
            </View>
          )}

          {form.placeType === "fun" && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>¿Qué tipo de lugar para divertirse?</Text>
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
                    {form.subType ? 
                      tipoLugarOpciones.find(opt => opt.value === form.subType)?.label : 
                      'Selecciona el subtipo'
                    }
                  </Button>
                }
                options={tipoLugarOpciones.filter(opt => opt.value === 'PARK' || opt.value === 'GAMES')}
                onSelect={value => {
                  handleChange('subType', value);
                  handleChange('placeCategoryToFun', value);
                }}
                selectedValue={form.subType}
              />
              {errors.subType && <Text style={[styles.errorText, { color: colors.error }]}>{errors.subType}</Text>}
            </View>
          )}

          {/* Campos comunes */}
          {form.subType && (
            <>
        <FormTextInput
                label="Nombre *"
          value={form.name}
          onChangeText={value => handleChange('name', value)}
          error={errors.name}
          placeholder="Nombre del lugar"
        />

        <FormTextInput
                label="Dirección *"
          value={form.address}
          onChangeText={value => handleChange('address', value)}
          error={errors.address}
          placeholder="Dirección del lugar"
        />

              <View style={styles.row}>
                <View style={styles.halfWidth}>
                  <Text style={[styles.label, { color: colors.onBackground }]}>Latitud <RequiredMark /></Text>
                  <TextInput
                    style={[styles.textInput, { backgroundColor: colors.surface, color: colors.onSurface, borderColor: errors.latitude ? colors.error : colors.outline }]}
                    value={form.latitude}
                    onChangeText={value => handleChange('latitude', value)}
                    placeholder="-12.0464"
                    keyboardType="numeric"
                  />
                  {errors.latitude && <Text style={[styles.errorText, { color: colors.error }]}>{errors.latitude}</Text>}
                </View>
                <View style={styles.halfWidth}>
                  <Text style={[styles.label, { color: colors.onBackground }]}>Longitud <RequiredMark /></Text>
                  <TextInput
                    style={[styles.textInput, { backgroundColor: colors.surface, color: colors.onSurface, borderColor: errors.longitude ? colors.error : colors.outline }]}
                    value={form.longitude}
                    onChangeText={value => handleChange('longitude', value)}
                    placeholder="-77.0428"
                    keyboardType="numeric"
                  />
                  {errors.longitude && <Text style={[styles.errorText, { color: colors.error }]}>{errors.longitude}</Text>}
                </View>
              </View>

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

              <FormTextInput
                label="Descripción *"
                value={form.description}
                onChangeText={value => handleChange('description', value)}
                error={errors.description}
                placeholder="Describe el lugar..."
                multiline
                numberOfLines={3}
              />

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

              {/* Campos opcionales */}
              {/* Menú solo para lugares de comida */}
              {form.placeType === 'eat' && (
                <FormTextInput
                  label="Menú (URL)"
                  value={form.menu}
                  onChangeText={value => handleChange('menu', value)}
                  error={errors.menu}
                  placeholder="https://ejemplo.com/menu"
                  keyboardType="url"
                />
              )}

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
              </View>

              <FormTextInput
                label="Precio estimado"
                value={form.estimatedPrice}
                onChangeText={value => handleChange('estimatedPrice', value)}
                error={errors.estimatedPrice}
                placeholder="25.00"
                keyboardType="numeric"
              />

              {/* Delivery solo para eat */}
              {form.placeType === 'eat' && (
                <>
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
                  {/* Subcampos según subtipo */}
                  {form.subType === 'COFFEE' && (
                    <>
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
                    </>
                  )}
                  {form.subType === 'RESTAURANT' && (
                    <>
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
                    </>
                  )}
                </>
              )}

              {/* Opcionales para fun */}
              {form.placeType === 'fun' && (
                <>
                  <FormTextInput
                    label="Juegos disponibles (separados por coma)"
                    value={form.games}
                    onChangeText={value => handleChange('games', value)}
                    error={errors.games}
                    placeholder="Fútbol, básquet, tenis"
                  />
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
                    </View>
                  </View>
                  {form.subType === 'PARK' && (
                    <>
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
                    </>
                  )}
                  {form.subType === 'GAMES' && (
                    <>
                      <FormTextInput
                        label="Precio por ficha"
                        value={form.priceFicha}
                        onChangeText={value => handleChange('priceFicha', value)}
                        error={errors.priceFicha}
                        placeholder="1.00"
                        keyboardType="numeric"
                      />
                    </>
                  )}
                </>
              )}
            </>
          )}

          {/* Botones */}
          {form.subType && (
            <View style={styles.buttonContainer}>
        <SaveButton onPress={handleSubmit} loading={isSubmitting} />
              {onClose && (
                <TouchableOpacity style={[styles.cancelButton, { backgroundColor: colors.surface, borderColor: colors.outline }]} onPress={onClose}>
                  <Text style={[styles.cancelButtonText, { color: colors.onSurfaceVariant }]}>Cancelar</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {toast.message ? (
        <SimpleToast 
          message={toast.message} 
          type={toast.type} 
          onHide={() => setToast({ ...toast, message: '' })} 
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8fafc',
    color: '#111827',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  halfWidth: {
    flex: 1,
  },
  dropdownButton: {
    borderColor: '#d1d5db',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  dropdownButtonContent: {
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    marginBottom: 20,
  },
  cancelButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  cancelButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#9ca3af',
    fontWeight: 'bold',
  },
  labelsList: {
    padding: 20,
  },
  labelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    marginBottom: 8,
  },
  labelItemSelected: {
    backgroundColor: '#dbeafe',
    borderColor: '#3b82f6',
  },
  labelColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  labelText: {
    fontSize: 16,
    color: '#111827',
  },
  labelTextSelected: {
    color: '#1e40af',
    fontWeight: '600',
  },
}); 