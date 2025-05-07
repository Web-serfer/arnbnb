'use client';

import React from 'react';

interface CategoryInputProps {
  icon: React.ElementType;
  label: string;
  selected?: boolean;
  onClick: (value: string) => void;
}

const CategoryInput: React.FC<CategoryInputProps> = ({
  icon: Icon,
  label,
  selected,
  onClick,
}) => {
  return (
    <div
      onClick={() => onClick(label)}
      className={`flex cursor-pointer flex-col gap-3 rounded-xl border-2 p-4 text-gray-500 transition hover:border-black hover:text-black ${
        selected ? 'border-black' : 'border-neutral-200'
      }`}
    >
      <Icon size={24} />
      <div className="font-semibold">{label}</div>
    </div>
  );
};

export default CategoryInput;
