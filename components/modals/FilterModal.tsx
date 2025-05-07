'use client';

import React from 'react';
import Modal from './Modal';
import Heading from '../Heading';
import useFiltersModal from '@/app/hooks/useFiltersModal';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const BodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Filters" subtitle="Adjust your search preferences" />
      {/* Здесь можно добавить поля для фильтров */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="form-checkbox" />
          <span>Wi-Fi</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" className="form-checkbox" />
          <span>Parking</span>
        </label>
        {/* Добавьте другие фильтры */}
      </div>
    </div>
  );

  const FooterContent = (
    <div className="mt-3 flex flex-col gap-2">
      <div className="mt-4 text-center">
        <span className="text-sm text-gray-500">
          Customize your search experience
        </span>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      title="Filters"
      actionLabel="Apply Filters"
      onClose={onClose}
      onSubmit={onSubmit}
      body={BodyContent}
      footer={FooterContent}
    />
  );
};

export default FilterModal;
