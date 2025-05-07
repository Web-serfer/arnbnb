'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Heading from '../../Heading';
import CountrySelect from '../../inputs/CountrySelect';
import { Country } from '@/app/hooks/useCountries';

// Динамический импорт компонента Map с отключением SSR
const MapWithNoSSR = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="h-[35vh] w-full bg-neutral-200 animate-pulse rounded-lg flex items-center justify-center">
      <p className="text-neutral-500">Загрузка карты...</p>
    </div>
  ),
});

interface LocationStepProps {
  setCustomValue: (id: 'location', value: Country | null) => void;
  location: Country | null;
}

const LocationStep: React.FC<LocationStepProps> = ({
  setCustomValue,
  location,
}) => {
  // Обработчик изменения значения в CountrySelect
  // SingleValue<Country> из react-select это и есть Country | null
  const handleCountryChange = (value: Country | null) => {
    setCustomValue('location', value);
  };

  return (
    <div className="flex flex-col gap-8">
      <Heading
        title="Where is your place located?"
        subtitle="Help guests find you!"
      />
      <CountrySelect value={location} onChange={handleCountryChange} />
      {/* Отображение карты с выбранной локацией */}
      <div className="mt-4 rounded-lg overflow-hidden">
        {' '}
        {/* Добавил overflow-hidden для скругления карты */}
        <MapWithNoSSR center={location?.latlng || null} />
      </div>
    </div>
  );
};

export default LocationStep;
