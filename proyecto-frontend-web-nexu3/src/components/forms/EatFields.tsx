import React from 'react';
import ValidationErrors from './FormTextInput';

interface EatFieldsProps {
  form: any;
  errors: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  deliveryOptions: { value: string; label: string }[];
  typeRestaurantOptions: { value: string; label: string }[];
  typeCoffeeOptions: { value: string; label: string }[];
}

const EatFields: React.FC<EatFieldsProps> = React.memo(({ form, errors, onChange, deliveryOptions, typeRestaurantOptions, typeCoffeeOptions }) => {
  return (
    <>
      {/* Menú (URL) */}
      <div>
        <label className="block text-base font-semibold text-gray-900 dark:text-white mb-2">Menú (URL)</label>
        <input
          type="text"
          name="menu"
          value={form.menu}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-[#F8FAFC] text-black dark:bg-white/10 dark:text-white font-sans"
          required
        />
        <ValidationErrors errors={errors.menu ? [errors.menu] : []} />
      </div>
      {/* Delivery */}
      <div>
        <label className="block text-base font-semibold text-gray-900 dark:text-white mb-2">¿Tiene delivery?</label>
        <select
          name="delivery"
          value={form.delivery}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-[#F8FAFC] text-black dark:bg-gray-800 dark:text-white font-sans"
          required
        >
          {deliveryOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ValidationErrors errors={errors.delivery ? [errors.delivery] : []} />
      </div>
      {/* Tipo de restaurante */}
      {form.subType === 'RESTAURANT' && (
        <div>
          <label className="block text-base font-semibold text-gray-900 dark:text-white mb-2">Tipo de restaurante</label>
          <select
            name="typeRestaurant"
            value={form.typeRestaurant}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-[#F8FAFC] text-black dark:bg-gray-800 dark:text-white font-sans"
            required
          >
            {typeRestaurantOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ValidationErrors errors={errors.typeRestaurant ? [errors.typeRestaurant] : []} />
        </div>
      )}
      {/* Tipo de café */}
      {form.subType === 'COFFEE' && (
        <div>
          <label className="block text-base font-semibold text-gray-900 dark:text-white mb-2">Tipo de café</label>
          <select
            name="typeCoffee"
            value={form.typeCoffee}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-[#F8FAFC] text-black dark:bg-gray-800 dark:text-white font-sans"
            required
          >
            {typeCoffeeOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ValidationErrors errors={errors.typeCoffee ? [errors.typeCoffee] : []} />
        </div>
      )}
    </>
  );
});

export default EatFields; 