import React from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'date' | 'number' | 'textarea' | 'select';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
  options?: { value: string; label: string }[];
  min?: string;
  max?: string;
  rows?: number;
  disabled?: boolean;
}

export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  className = '',
  options = [],
  min,
  max,
  rows = 4,
  disabled = false
}: FormFieldProps) {
  const baseInputClasses = "w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#F8FAFC] text-black dark:bg-gray-800 dark:text-white";
  const errorClasses = error ? "border-red-500 focus:ring-red-500" : "";
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  const renderField = () => {
    const commonProps = {
      name,
      value,
      onChange,
      placeholder,
      required,
      disabled,
      className: `${baseInputClasses} ${errorClasses} ${disabledClasses} ${className}`,
      ...(min && { min }),
      ...(max && { max })
    };

    switch (type) {
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows={rows}
          />
        );
      
      case 'select':
        return (
          <select {...commonProps}>
            <option value="">Selecciona una opción</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      default:
        return (
          <input
            {...commonProps}
            type={type}
          />
        );
    }
  };

  return (
    <div className="w-full">
      <label className="block text-base font-semibold text-gray-900 dark:text-gray-300 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {renderField()}
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
} 