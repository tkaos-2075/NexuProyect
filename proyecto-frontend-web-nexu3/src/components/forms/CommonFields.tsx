import React from 'react';
import FormField from '../common/FormField';
import TimeInput from './TimeInput';

interface CommonFieldsProps {
  form: any;
  errors: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  statusOptions: { value: string; label: string }[];
  wifiOptions: { value: string; label: string }[];
  priceRangeOptions: { value: string; label: string }[];
  hidePriceFields?: boolean;
}

const CommonFields: React.FC<CommonFieldsProps> = React.memo(({ form, errors, onChange, statusOptions, wifiOptions, priceRangeOptions, hidePriceFields }) => {
  const paymentOptions = [
    { value: 'EFECTIVO', label: 'Efectivo' },
    { value: 'TARJETA', label: 'Tarjeta' },
    { value: 'YAPE', label: 'Yape' },
    { value: 'GRATIS', label: 'Gratis' }
  ];

  return (
    <>
      {/* Nombre */}
      <FormField
        label="Nombre"
        name="name"
        type="text"
        value={form.name || ''}
        onChange={onChange}
        required
        error={errors.name}
      />

      {/* Dirección */}
      <FormField
        label="Dirección"
        name="address"
        type="text"
        value={form.address || ''}
        onChange={onChange}
        required
        error={errors.address}
      />

      {/* Horario de apertura */}
      <TimeInput
        label="Hora de apertura"
        name="openTime"
        value={form.openTime || ''}
        onChange={onChange}
        required
        error={errors.openTime}
      />

      {/* Horario de cierre */}
      <TimeInput
        label="Hora de cierre"
        name="closeTime"
        value={form.closeTime || ''}
        onChange={onChange}
        required
        error={errors.closeTime}
      />

      {/* Descripción */}
      <FormField
        label="Descripción"
        name="description"
        type="textarea"
        value={form.description || ''}
        onChange={onChange}
        required
        error={errors.description}
      />

      {/* Capacidad */}
      <FormField
        label="Capacidad"
        name="capacity"
        type="number"
        value={form.capacity || ''}
        onChange={onChange}
        required
        error={errors.capacity}
      />

      {/* Estado */}
      <FormField
        label="Estado"
        name="status"
        type="select"
        value={form.status || ''}
        onChange={onChange}
        options={statusOptions}
        required
        error={errors.status}
      />

      {/* Wifi */}
      <FormField
        label="¿Tiene wifi?"
        name="wifi"
        type="select"
        value={form.wifi || ''}
        onChange={onChange}
        options={wifiOptions}
        required
        error={errors.wifi}
      />

      {/* Método de pago, rango de precios y precio estimado juntos */}
      <div className="grid grid-cols-1 gap-4">
        {/* Método de pago */}
        <FormField
          label="Método de pago"
          name="payment"
          type="select"
          value={form.payment || ''}
          onChange={onChange}
          options={paymentOptions}
          required
          error={errors.payment}
        />
        
        {/* Rango de precios */}
        {!hidePriceFields && (
          <FormField
            label="Rango de precios"
            name="priceRange"
            type="select"
            value={form.priceRange || ''}
            onChange={onChange}
            options={priceRangeOptions}
            required
            error={errors.priceRange}
          />
        )}
        
        {/* Precio estimado */}
        {!hidePriceFields && (
          <FormField
            label="Precio estimado"
            name="estimatedPrice"
            type="number"
            value={form.estimatedPrice || ''}
            onChange={onChange}
            required
            error={errors.estimatedPrice}
          />
        )}
      </div>
    </>
  );
});

export default CommonFields; 