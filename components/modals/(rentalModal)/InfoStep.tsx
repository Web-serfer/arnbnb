import React from 'react';
import Heading from '../../Heading';
import Counter from '../../inputs/Counter';
import Toggle from '../../inputs/Toggle';

// Импортируем FormValues из основного компонента
import { FormValues } from './RentModal';

interface InfoStepProps {
  // Основные счетчики
  guestCount: number;
  roomCount: number;
  bathroomCount: number;

  // Удобства
  hasWifi: boolean;
  hasPool: boolean;
  hasKitchen: boolean;
  hasParking: boolean;
  hasTV: boolean;
  hasAC: boolean;
  hasHeating: boolean;
  hasWasher: boolean;
  hasDryer: boolean;

  // Типизированная функция обновления значений
  setCustomValue: <K extends keyof FormValues>(
    id: K,
    value: FormValues[K]
  ) => void;
}

const InfoStep: React.FC<InfoStepProps> = ({
  guestCount,
  roomCount,
  bathroomCount,
  hasWifi,
  hasPool,
  hasKitchen,
  hasParking,
  hasTV,
  hasAC,
  hasHeating,
  hasWasher,
  hasDryer,
  setCustomValue,
}) => {
  return (
    <div className="flex flex-col gap-8">
      <Heading
        title="Share some basics about your place"
        subtitle="What amenities do you have?"
      />

      <div className="flex flex-col gap-8">
        {/* Блок счетчиков */}
        <div className="space-y-4">
          <Counter
            title="Guests"
            subtitle="How many guests do you allow?"
            value={guestCount}
            onChange={(value) => setCustomValue('guestCount', value)}
            minValue={1}
          />
          <Counter
            title="Rooms"
            subtitle="How many rooms do you have?"
            value={roomCount}
            onChange={(value) => setCustomValue('roomCount', value)}
            minValue={1}
          />
          <Counter
            title="Bathrooms"
            subtitle="How many bathrooms do you have?"
            value={bathroomCount}
            onChange={(value) => setCustomValue('bathroomCount', value)}
            minValue={1}
          />
        </div>

        <hr />

        {/* Блок удобств */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Toggle
            label="Wifi"
            value={hasWifi}
            onChange={(value) => setCustomValue('hasWifi', value)}
          />
          <Toggle
            label="Pool"
            value={hasPool}
            onChange={(value) => setCustomValue('hasPool', value)}
          />
          <Toggle
            label="Kitchen"
            value={hasKitchen}
            onChange={(value) => setCustomValue('hasKitchen', value)}
          />
          <Toggle
            label="Parking"
            value={hasParking}
            onChange={(value) => setCustomValue('hasParking', value)}
          />
          <Toggle
            label="TV"
            value={hasTV}
            onChange={(value) => setCustomValue('hasTV', value)}
          />
          <Toggle
            label="Air conditioning"
            value={hasAC}
            onChange={(value) => setCustomValue('hasAC', value)}
          />
          <Toggle
            label="Heating"
            value={hasHeating}
            onChange={(value) => setCustomValue('hasHeating', value)}
          />
          <Toggle
            label="Washer"
            value={hasWasher}
            onChange={(value) => setCustomValue('hasWasher', value)}
          />
          <Toggle
            label="Dryer"
            value={hasDryer}
            onChange={(value) => setCustomValue('hasDryer', value)}
          />
        </div>
      </div>
    </div>
  );
};

export default InfoStep;
