'use client';

import React, { useCallback } from 'react';

interface CounterProps {
  title: string;
  subtitle: string;
  value: number;
  onChange: (value: number) => void;
  minValue?: number; // Минимальное значение (по умолчанию 0)
  maxValue?: number; // Максимальное значение
  disableDecrement?: boolean; // Отключить кнопку уменьшения
}

const Counter: React.FC<CounterProps> = ({
  title,
  subtitle,
  value,
  onChange,
  minValue = 0,
  maxValue,
  disableDecrement = false,
}) => {
  const handleDecrement = useCallback(() => {
    if (value > minValue) {
      onChange(value - 1);
    }
  }, [value, minValue, onChange]);

  const handleIncrement = useCallback(() => {
    if (maxValue === undefined || value < maxValue) {
      onChange(value + 1);
    }
  }, [value, maxValue, onChange]);

  const decrementButtonClass = `flex h-8 w-8 sm:h-10 sm:w-10 cursor-pointer items-center justify-center rounded-full border-[1px] border-neutral-400 text-neutral-600 transition hover:opacity-80 ${
    disableDecrement || value <= minValue ? 'cursor-not-allowed opacity-50' : ''
  }`;

  const incrementButtonClass = `flex h-8 w-8 sm:h-10 sm:w-10 cursor-pointer items-center justify-center rounded-full border-[1px] border-neutral-400 text-neutral-600 transition hover:opacity-80 ${
    maxValue !== undefined && value >= maxValue
      ? 'cursor-not-allowed opacity-50'
      : ''
  }`;

  return (
    <div className="flex flex-row items-center justify-between">
      <div>
        {/* Уменьшаем шрифт на мобильных устройствах */}
        <div className="text-sm font-semibold sm:text-base">{title}</div>
        <div className="text-xs font-light text-gray-600 sm:text-sm">
          {subtitle}
        </div>
      </div>
      <div className="flex flex-row items-center gap-4">
        {/* Кнопка уменьшения */}
        <button
          onClick={handleDecrement}
          disabled={disableDecrement || value <= minValue}
          type="button"
          className={decrementButtonClass}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-3 w-3 sm:h-4 sm:w-4" // Уменьшаем размер иконки на мобильных устройствах
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 12h-15"
            />
          </svg>
        </button>
        {/* Уменьшаем шрифт на мобильных устройствах */}
        <div className="text-lg font-light text-neutral-600 sm:text-xl">
          {value}
        </div>
        {/* Кнопка увеличения */}
        <button
          onClick={handleIncrement}
          disabled={maxValue !== undefined && value >= maxValue}
          type="button"
          className={incrementButtonClass}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-3 w-3 sm:h-4 sm:w-4" // Уменьшаем размер иконки на мобильных устройствах
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Counter;
