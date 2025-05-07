'use client';

import React from 'react';
import Heading from '../../Heading';
import { FormValues } from './RentModal';

interface DescriptionStepProps {
  title: FormValues['title'];
  description: FormValues['description'];
  setCustomValue: <K extends 'title' | 'description'>(
    id: K,
    value: FormValues[K]
  ) => void;
  maxTitleLength?: number;
  maxDescriptionLength?: number;
  isLoading: boolean;
  translations?: {
    titleLabel?: string;
    descriptionLabel?: string;
    titlePlaceholder?: string;
    descriptionPlaceholder?: string;
    limitReachedMessage?: string;
  };
}

const DescriptionStep: React.FC<DescriptionStepProps> = ({
  title,
  description,
  setCustomValue,
  maxTitleLength = 50,
  maxDescriptionLength = 500,
  isLoading, // Получаем пропс
  translations = {},
}) => {
  const {
    titleLabel = 'Title',
    descriptionLabel = 'Description',
    titlePlaceholder = 'e.g., Cozy apartment in the city center',
    descriptionPlaceholder = 'e.g., Spacious apartment with a park view, perfect for family vacations.',
    limitReachedMessage = 'Maximum length reached',
  } = translations;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, maxTitleLength);
    setCustomValue('title', value);
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value.slice(0, maxDescriptionLength);
    setCustomValue('description', value);
  };

  const titleCharsLeft = maxTitleLength - title.length;
  const descriptionCharsLeft = maxDescriptionLength - description.length;

  return (
    <div className="flex flex-col gap-8">
      <Heading
        title="How would you describe your place?"
        subtitle="Short and sweet works best!"
      />

      <div className="flex flex-col gap-6">
        <div className="relative w-full">
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-sm font-medium text-neutral-700">
              {titleLabel}
            </label>
            <span
              className={`text-sm ${titleCharsLeft === 0 ? 'text-rose-500' : 'text-neutral-500'}`}
            >
              {title.length}/{maxTitleLength}
            </span>
          </div>

          <input
            value={title}
            onChange={handleTitleChange}
            className={`w-full rounded-lg border p-3 transition-colors focus:outline-none ${
              titleCharsLeft === 0
                ? 'border-rose-500 ring-1 ring-rose-500'
                : 'border-neutral-300 focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500'
            }`}
            placeholder={titlePlaceholder}
            aria-label="Enter property title"
            maxLength={maxTitleLength}
            disabled={isLoading} // Используем isLoading для блокировки
          />

          {titleCharsLeft === 0 && (
            <p className="mt-1 text-sm text-rose-500">{limitReachedMessage}</p>
          )}
        </div>

        <div className="relative w-full">
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-sm font-medium text-neutral-700">
              {descriptionLabel}
            </label>
            <span
              className={`text-sm ${descriptionCharsLeft === 0 ? 'text-rose-500' : 'text-neutral-500'}`}
            >
              {description.length}/{maxDescriptionLength}
            </span>
          </div>

          <textarea
            value={description}
            onChange={handleDescriptionChange}
            rows={5}
            className={`w-full rounded-lg border p-3 transition-colors focus:outline-none ${
              descriptionCharsLeft === 0
                ? 'border-rose-500 ring-1 ring-rose-500'
                : 'border-neutral-300 focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500'
            }`}
            placeholder={descriptionPlaceholder}
            aria-label="Enter property description"
            maxLength={maxDescriptionLength}
            disabled={isLoading} // Используем isLoading для блокировки
          />

          {descriptionCharsLeft === 0 && (
            <p className="mt-1 text-sm text-rose-500">{limitReachedMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DescriptionStep;
