'use client';

import React from 'react';
import Select, { SingleValue } from 'react-select';
import useCountries, { Country } from '@/app/hooks/useCountries';
import Image from 'next/image';

interface CountrySelectProps {
  onChange?: (value: Country | null) => void;
  value?: Country | null;
}

const CountrySelect: React.FC<CountrySelectProps> = ({ value, onChange }) => {
  const { getAll } = useCountries();

  const handleOnChange = (newValue: SingleValue<Country>) => {
    if (onChange) {
      onChange(newValue); // newValue уже имеет тип Country | null
    }
  };

  return (
    <div>
      <Select
        placeholder="Your country"
        isClearable
        options={getAll()}
        value={value}
        onChange={handleOnChange}
        formatOptionLabel={(option: Country) => (
          <div className="flex items-center gap-3">
            {option.value && ( // Добавим проверку на существование option.value для URL флага
              <Image
                src={`https://flagcdn.com/${option.value.toLowerCase()}.svg`}
                className="object-contain shadow-sm" // object-contain может быть лучше для флагов
                width={20}
                height={15} // Чуть изменим пропорции для флагов
                alt={option.label}
                unoptimized // Хорошо для SVG
                onError={(e) => {
                  // Прячем сам Image, если не загрузился, а не родителя
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <div>
              {option.label}
              <span className="ml-2 text-sm text-neutral-500">
                ({option.region})
              </span>
            </div>
          </div>
        )}
        styles={{
          control: (base, state) => ({
            ...base,
            padding: '6px', // Уменьшил padding для более компактного вида
            borderWidth: state.isFocused ? '2px' : '1px', // Тоньше рамка по умолчанию
            borderRadius: '8px', // Увеличил borderRadius
            borderColor: state.isFocused ? 'black' : '#D1D5DB', // Tailwind gray-300
            boxShadow: state.isFocused ? '0 0 0 1px black' : 'none', // Фокус как у Tailwind
            '&:hover': {
              borderColor: state.isFocused ? 'black' : '#9CA3AF', // Tailwind gray-400
            },
          }),
          input: (base) => ({
            ...base,
            margin: '0px',
            padding: '0px',
          }),
          valueContainer: (base) => ({
            ...base,
            padding: '0px 8px',
          }),
          option: (base, state) => ({
            ...base,
            fontSize: '0.9rem',
            padding: '10px 15px',
            backgroundColor: state.isSelected
              ? 'black'
              : state.isFocused
                ? '#F3F4F6' // Tailwind gray-100 для hover
                : 'white',
            color: state.isSelected ? 'white' : 'black',
            ':active': {
              // Для лучшего UX при клике
              ...base[':active'],
              backgroundColor: state.isSelected ? 'black' : '#E5E7EB', // Tailwind gray-200
            },
          }),
          menu: (base) => ({
            ...base,
            maxHeight: '250px',
            overflowY: 'auto',
            borderRadius: '8px',
            marginTop: '4px',
            boxShadow:
              '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)', // Tailwind shadow-lg
            zIndex: 10, // Убедимся, что меню выше других элементов на странице
          }),
          menuPortal: (base) => ({
            ...base,
            zIndex: 9999, // Высокий zIndex для портала
          }),
        }}
        // menuPortalTarget важно проверять на window, если есть SSR
        menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
        menuPosition="fixed"
        classNamePrefix="react-select"
      />
    </div>
  );
};

export default CountrySelect;
