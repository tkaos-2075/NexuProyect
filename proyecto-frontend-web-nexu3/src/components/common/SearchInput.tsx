
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Buscar...",
  className = "",
  label
}: SearchInputProps) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-base font-semibold text-gray-900 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#F8FAFC] text-black dark:bg-gray-800 dark:text-white"
      />
    </div>
  );
} 