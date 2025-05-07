'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import useRentModalStore from '@/app/hooks/useRentModal';
import Modal from '../Modal';
import CategoryStep from './CategoryStep';
import LocationStep from './LocationStep';
import InfoStep from './InfoStep';
import DescriptionStep from './DescriptionStep';
import PriceStep from './PriceStep';
import ImagesStep from './ImagesStep'; // Added missing import

interface UploadedImage {
  url: string;
  publicId: string;
}

enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4,
  PRICE = 5,
}

interface Location {
  value: string;
  label: string;
  latlng: [number, number];
  region: string;
  flag: string;
}

export interface FormValues {
  category: string;
  location: Location | null;
  guestCount: number;
  roomCount: number;
  bathroomCount: number;
  imageSrc: UploadedImage[];
  price: number;
  title: string;
  description: string;
  hasWifi: boolean;
  hasPool: boolean;
  hasKitchen: boolean;
  hasParking: boolean;
  hasTV: boolean;
  hasAC: boolean;
  hasHeating: boolean;
  hasWasher: boolean;
  hasDryer: boolean;
}

const defaultValues: FormValues = {
  category: '',
  location: null,
  guestCount: 1,
  roomCount: 1,
  bathroomCount: 1,
  imageSrc: [],
  price: 0,
  title: '',
  description: '',
  hasWifi: false,
  hasPool: false,
  hasKitchen: false,
  hasParking: false,
  hasTV: false,
  hasAC: false,
  hasHeating: false,
  hasWasher: false,
  hasDryer: false,
};

const RentModal = () => {
  const router = useRouter();
  const rentModal = useRentModalStore();
  const [step, setStep] = useState<STEPS>(STEPS.CATEGORY);
  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, setValue, watch, reset } = useForm<FormValues>({
    defaultValues,
    mode: 'onTouched',
  });

  const formValues = watch();

  const setCustomValue = useCallback(
    <K extends keyof FormValues>(id: K, value: FormValues[K]) => {
      setValue(id, value, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    },
    [setValue]
  );

  const isStepValid = useMemo(() => {
    const validators = {
      [STEPS.CATEGORY]: !!formValues.category,
      [STEPS.LOCATION]: !!formValues.location,
      [STEPS.INFO]:
        formValues.guestCount > 0 &&
        formValues.roomCount > 0 &&
        formValues.bathroomCount > 0,
      [STEPS.IMAGES]:
        formValues.imageSrc.length > 0 && formValues.imageSrc.length <= 3,
      [STEPS.DESCRIPTION]:
        formValues.title.trim().length >= 5 &&
        formValues.description.trim().length >= 10,
      [STEPS.PRICE]: formValues.price >= 1,
    };
    return validators[step];
  }, [step, formValues]);

  const onBack = useCallback(() => {
    if (step === STEPS.CATEGORY) return;
    setStep(step - 1);
  }, [step]);

  const onNext = useCallback(() => {
    if (!isStepValid) {
      toast.error('Please complete the current step.');
      return;
    }
    if (step === STEPS.PRICE) return;
    setStep(step + 1);
  }, [step, isStepValid]);

  const onSubmit = useCallback(
    async (data: FormValues) => {
      if (!isStepValid || step !== STEPS.PRICE) {
        console.error('Attempted submit on invalid step or data');
        return;
      }

      setIsLoading(true);
      try {
        await axios.post('/api/listings', data);
        toast.success('Listing created successfully!');
        router.refresh();
        reset();
        setStep(STEPS.CATEGORY);
        rentModal.onClose();
      } catch (error) {
        console.error('Error creating listing:', error);
        toast.error('Failed to create listing. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [isStepValid, step, router, reset, rentModal]
  );

  useEffect(() => {
    if (!rentModal.isOpen) {
      reset(defaultValues);
      setStep(STEPS.CATEGORY);
    }
  }, [rentModal.isOpen, reset]);

  const actionLabel = useMemo(
    () => (step === STEPS.PRICE ? 'Create' : 'Next'),
    [step]
  );

  const secondaryActionLabel = useMemo(
    () => (step !== STEPS.CATEGORY ? 'Back' : undefined),
    [step]
  );

  const renderStepContent = useCallback(() => {
    const commonProps = {
      setCustomValue,
      isLoading,
    };

    switch (step) {
      case STEPS.CATEGORY:
        return <CategoryStep category={formValues.category} {...commonProps} />;
      case STEPS.LOCATION:
        return <LocationStep location={formValues.location} {...commonProps} />;
      case STEPS.INFO:
        return (
          <InfoStep
            guestCount={formValues.guestCount}
            roomCount={formValues.roomCount}
            bathroomCount={formValues.bathroomCount}
            hasWifi={formValues.hasWifi}
            hasPool={formValues.hasPool}
            hasKitchen={formValues.hasKitchen}
            hasParking={formValues.hasParking}
            hasTV={formValues.hasTV}
            hasAC={formValues.hasAC}
            hasHeating={formValues.hasHeating}
            hasWasher={formValues.hasWasher}
            hasDryer={formValues.hasDryer}
            {...commonProps}
          />
        );
      case STEPS.IMAGES:
        return (
          <ImagesStep
            imageSrc={formValues.imageSrc}
            setCustomValue={setCustomValue}
            isLoading={isLoading}
          />
        );
      case STEPS.DESCRIPTION:
        return (
          <DescriptionStep
            title={formValues.title}
            description={formValues.description}
            {...commonProps}
          />
        );
      case STEPS.PRICE:
        return <PriceStep price={formValues.price} {...commonProps} />;
      default:
        return null;
    }
  }, [step, formValues, isLoading, setCustomValue]);

  return (
    <Modal
      isOpen={rentModal.isOpen}
      onClose={rentModal.onClose}
      onSubmit={step === STEPS.PRICE ? handleSubmit(onSubmit) : onNext}
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
      title="Create your listing"
      body={<div className="flex flex-col gap-8">{renderStepContent()}</div>}
      disabled={!isStepValid || isLoading}
    />
  );
};

export default RentModal;
