import React, { useCallback } from 'react';

interface ToggleProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

const Toggle: React.FC<ToggleProps> = ({
  label,
  value,
  onChange,
  disabled = false,
}) => {
  const handleToggle = useCallback(() => {
    if (!disabled) {
      onChange(!value);
    }
  }, [value, onChange, disabled]);

  const toggleButtonClass = `relative inline-flex h-5 w-9 sm:h-6 sm:w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 ${
    value ? 'bg-rose-500' : 'bg-neutral-200'
  } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`;

  return (
    <div className="flex flex-row items-center justify-between">
      {/* Уменьшаем размер текста на мобильных устройствах */}
      <span className="text-sm font-semibold sm:text-base">{label}</span>
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={toggleButtonClass}
      >
        <span
          aria-hidden="true"
          role="switch"
          aria-checked={value}
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out sm:h-5 sm:w-5 ${
            value ? 'translate-x-4 sm:translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};

export default Toggle;
