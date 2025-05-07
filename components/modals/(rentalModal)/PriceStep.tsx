'use client';

import React from 'react';
import Heading from '../../Heading';
import { FormValues } from './RentModal';

interface PriceStepProps {
  price: FormValues['price'];
  setCustomValue: <K extends keyof FormValues>(
    id: K,
    value: FormValues[K]
  ) => void;
  isLoading?: boolean;
}

const PriceStep: React.FC<PriceStepProps> = ({
  price,
  setCustomValue,
  isLoading,
}) => {
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = parseInt(value.replace(/\D/g, '')) || 0;

    // Явно указываем поле 'price' как ключ
    setCustomValue('price', numericValue);
  };

  const displayValue = price > 0 ? price.toString() : '';

  return (
    <div className="flex flex-col gap-8">
      <Heading
        title="Now, set your price"
        subtitle="How much do you charge per night?"
      />

      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <label
            htmlFor="price"
            className="mb-2 block text-sm font-medium text-neutral-700"
          >
            Price
          </label>

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-neutral-500">$</span>
            </div>
            <input
              id="price"
              type="text"
              value={displayValue}
              onChange={handlePriceChange}
              placeholder="0"
              className="block w-full rounded-md border-2 border-neutral-300 p-3 pl-7 pr-24 outline-none transition focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm"
              inputMode="numeric"
              disabled={isLoading}
              required
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-500">USD</span>
                {price > 0 && (
                  <>
                    <div className="h-4 w-px bg-neutral-300" />
                    <span className="text-sm text-neutral-500">per night</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceStep;
