import Select from "react-select";

interface LabelOption {
  value: number;
  label: string;
  color: string;
}

interface LabelSelectorProps {
  labels: LabelOption[];
  selected: number[] | number | "";
  onChange: (selected: any) => void;
  isMulti?: boolean;
  isLoading?: boolean;
  error?: string;
}

export default function LabelSelector({
  labels,
  selected,
  onChange,
  isMulti = false,
  isLoading = false,
  error
}: LabelSelectorProps) {
  return (
    <div>
      <Select
        isMulti={isMulti}
        options={labels}
        value={
          isMulti
            ? labels.filter(opt => (selected as number[]).includes(opt.value))
            : labels.find(opt => opt.value === selected)
        }
        onChange={onChange}
        isLoading={isLoading}
        classNamePrefix="react-select"
        placeholder="Selecciona etiquetas..."
        styles={{
          control: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused
              ? (document.documentElement.classList.contains('dark') ? '#1f2937' : 'white')
              : (document.documentElement.classList.contains('dark') ? '#1f2937' : 'white'),
            color: document.documentElement.classList.contains('dark') ? 'white' : 'black',
            borderColor: document.documentElement.classList.contains('dark') ? '#374151' : '#d1d5db',
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: document.documentElement.classList.contains('dark') ? '#1f2937' : 'white',
            color: document.documentElement.classList.contains('dark') ? 'white' : 'black',
          }),
          option: (base, state) => ({
            ...base,
            color: document.documentElement.classList.contains('dark') ? 'white' : 'black',
            backgroundColor: state.isSelected
              ? (document.documentElement.classList.contains('dark') ? '#374151' : '#ede9fe')
              : (state.isFocused ? (document.documentElement.classList.contains('dark') ? '#374151' : '#f3f4f6') : (document.documentElement.classList.contains('dark') ? '#1f2937' : 'white')),
          }),
          multiValue: (base, state) => ({ ...base, backgroundColor: state.data.color, color: 'white' }),
          multiValueLabel: (base) => ({ ...base, color: 'white', fontWeight: 600 }),
          multiValueRemove: (base) => ({ ...base, color: 'white', ':hover': { backgroundColor: '#ef4444', color: 'white' } }),
        }}
        noOptionsMessage={() => 'No hay etiquetas disponibles'}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
} 