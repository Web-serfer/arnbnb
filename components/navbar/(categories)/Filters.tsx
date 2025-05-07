'use client';

import React from 'react';
import { FaFilter } from 'react-icons/fa';

interface FiltersProps {
  onFiltersToggle: () => void;
  isActive?: boolean;
}

const Filters: React.FC<FiltersProps> = ({
  onFiltersToggle,
  isActive = false,
}) => {
  return (
    <button
      className={`mb-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border px-4 py-2 transition-all duration-200 hover:shadow-md sm:mb-0 sm:mt-0 sm:w-[10%] ${
        isActive
          ? 'border-black bg-neutral-50'
          : 'border-gray-300 text-gray-500'
      }`}
      onClick={onFiltersToggle}
      aria-label="Filters"
    >
      <FaFilter
        className={`transition-colors ${
          isActive ? 'text-black' : 'hover:text-black'
        }`}
      />
      <span className="text-sm font-semibold">Filters</span>
    </button>
  );
};

export default Filters;
