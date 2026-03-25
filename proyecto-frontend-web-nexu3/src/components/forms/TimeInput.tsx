import React, { useState, useEffect } from 'react';
import ValidationErrors from './FormTextInput';

interface TimeInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  error?: string;
}

const TimeInput: React.FC<TimeInputProps> = ({ label, name, value, onChange, required = false, error }) => {
  const [timeValue, setTimeValue] = useState('');
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');
  const [isFocused, setIsFocused] = useState(false);

  // Convertir formato 24h a 12h para mostrar
  const formatTo12Hour = (time24: string): { time: string; period: 'AM' | 'PM' } => {
    if (!time24 || time24.length < 4) return { time: '', period: 'AM' };
    
    try {
      const [hours, minutes] = time24.split(':');
      const hour = parseInt(hours);
      const minute = parseInt(minutes);
      
      if (isNaN(hour) || isNaN(minute)) return { time: '', period: 'AM' };
      
      const period = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      
      return {
        time: `${hour12.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
        period
      };
    } catch {
      return { time: '', period: 'AM' };
    }
  };

  // Convertir formato 12h a 24h para guardar
  const formatTo24Hour = (time12: string, period: 'AM' | 'PM'): string => {
    if (!time12) return '';
    
    try {
      const [hour, minute] = time12.split(':');
      let hourNum = parseInt(hour);
      const minuteNum = parseInt(minute);
      
      if (isNaN(hourNum) || isNaN(minuteNum)) return '';
      
      // Convertir a formato 24h
      if (period === 'PM' && hourNum !== 12) {
        hourNum += 12;
      } else if (period === 'AM' && hourNum === 12) {
        hourNum = 0;
      }
      
      return `${hourNum.toString().padStart(2, '0')}:${minuteNum.toString().padStart(2, '0')}`;
    } catch {
      return '';
    }
  };

  // Actualizar valores cuando cambie el value
  useEffect(() => {
    if (!isFocused) {
      const { time, period: newPeriod } = formatTo12Hour(value);
      setTimeValue(time);
      setPeriod(newPeriod);
    }
  }, [value, isFocused]);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setTimeValue(input);
    
    // Validar formato de tiempo
    const timeRegex = /^(\d{1,2}):(\d{2})$/;
    if (timeRegex.test(input)) {
      const time24 = formatTo24Hour(input, period);
      if (time24) {
        onChange({
          target: {
            name,
            value: time24,
          },
        } as any);
      }
    }
  };

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPeriod = e.target.value as 'AM' | 'PM';
    setPeriod(newPeriod);
    
    if (timeValue) {
      const time24 = formatTo24Hour(timeValue, newPeriod);
      if (time24) {
        onChange({
          target: {
            name,
            value: time24,
          },
        } as any);
      }
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    
    // Intentar formatear el input si no está completo
    if (timeValue && !timeValue.match(/^(\d{1,2}):(\d{2})$/)) {
      // Si solo tiene números, intentar formatear
      const numbers = timeValue.replace(/\D/g, '');
      if (numbers.length >= 3) {
        const hour = parseInt(numbers.slice(0, -2));
        const minute = parseInt(numbers.slice(-2));
        
        if (hour >= 1 && hour <= 12 && minute >= 0 && minute <= 59) {
          const formatted = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          setTimeValue(formatted);
          
          const time24 = formatTo24Hour(formatted, period);
          if (time24) {
            onChange({
              target: {
                name,
                value: time24,
              },
            } as any);
          }
        }
      }
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  return (
    <div>
      <label className="block text-base font-semibold text-gray-900 dark:text-white mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          name={name}
          value={timeValue}
          onChange={handleTimeChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder="12:00"
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-[#F8FAFC] text-black dark:bg-white/10 dark:text-white font-sans"
          required={required}
        />
        <select
          value={period}
          onChange={handlePeriodChange}
          className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-[#F8FAFC] text-black dark:bg-gray-800 dark:text-white font-sans"
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
      <ValidationErrors errors={error ? [error] : []} />
    </div>
  );
};

export default TimeInput; 