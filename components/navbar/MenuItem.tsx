'use client';

import React from 'react';

interface MenuItemProps {
  onClick: () => void;
  label: string;
  icon?: React.ReactNode;
}

const MenuItem: React.FC<MenuItemProps> = ({ onClick, label, icon }) => {
  return (
    <div
      onClick={() => {
        onClick();
      }}
      className="flex cursor-pointer items-center gap-2 px-4 py-3 font-semibold transition hover:bg-neutral-100"
    >
      {icon && icon}
      {label}
    </div>
  );
};

export default MenuItem;
