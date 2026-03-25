import React from 'react';
import ValidationErrors from './FormTextInput';

interface FunFieldsProps {
  form: any;
  errors: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  sizeParkOptions: { value: string; label: string }[];
  forceHaveGames?: boolean;
}

const FunFields: React.FC<FunFieldsProps> = React.memo(({ form, errors, onChange, sizeParkOptions, forceHaveGames }) => {
  React.useEffect(() => {
    if (forceHaveGames && form.haveGames !== 'true') {
      onChange({
        target: {
          name: 'haveGames',
          value: 'true',
        },
      } as any);
    }
  }, [forceHaveGames, onChange]);

  return (
    <>
      {form.subType === 'PARK' && (
        <div>
          <label className="block text-base font-semibold text-gray-900 dark:text-white mb-2">¿Tiene juegos?</label>
          <select
            name="haveGames"
            value={form.haveGames}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-[#F8FAFC] text-black dark:bg-gray-800 dark:text-white font-sans"
            required
          >
            <option value="">Selecciona una opción</option>
            <option value="true">Sí</option>
            <option value="false">No</option>
          </select>
          <ValidationErrors errors={errors.haveGames ? [errors.haveGames] : []} />
        </div>
      )}
      {((form.subType === 'PARK' && form.haveGames === 'true') || form.subType === 'GAMES') && (
        <div>
          <label className="block text-base font-semibold text-gray-900 dark:text-white mb-2">Juegos</label>
          <input
            type="text"
            name="games"
            value={form.games}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-[#F8FAFC] text-black dark:bg-white/10 dark:text-white font-sans"
            required
          />
          <ValidationErrors errors={errors.games ? [errors.games] : []} />
        </div>
      )}
      {form.subType === 'PARK' && (
        <div>
          <label className="block text-base font-semibold text-gray-900 dark:text-white mb-2">Tamaño del parque</label>
          <select
            name="sizePark"
            value={form.sizePark}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-[#F8FAFC] text-black dark:bg-gray-800 dark:text-white font-sans"
            required
          >
            {sizeParkOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ValidationErrors errors={errors.sizePark ? [errors.sizePark] : []} />
        </div>
      )}
      {form.subType === 'GAMES' && (
        <div>
          <label className="block text-base font-semibold text-gray-900 dark:text-white mb-2">Precio por ficha</label>
          <input
            type="number"
            name="priceFicha"
            value={form.priceFicha}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-[#F8FAFC] text-black dark:bg-white/10 dark:text-white font-sans"
            required
          />
          <ValidationErrors errors={errors.priceFicha ? [errors.priceFicha] : []} />
        </div>
      )}
    </>
  );
});

export default FunFields; 