import React from 'react';

interface PlaceTypeSelectorProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const PlaceTypeSelector: React.FC<PlaceTypeSelectorProps> = React.memo(({ value, onChange }) => (
  <div>
    <label className="block text-base font-semibold text-gray-900 dark:text-white mb-2">¿Qué tipo de lugar quieres agregar?</label>
    <select
      name="placeType"
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-[#F8FAFC] text-black dark:bg-gray-800 dark:text-white font-sans"
      required
    >
      <option value="">Selecciona...</option>
      <option value="eat">Lugar para comer</option>
      <option value="fun">Lugar para divertirse</option>
    </select>
  </div>
));

export default PlaceTypeSelector; 