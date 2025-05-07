'use client';

import React from 'react';
import Heading from '../../Heading';
import ImageUpload from '../../inputs/ImageUpload';
import toast from 'react-hot-toast';
import { FormValues } from './RentModal';

interface UploadedImage {
  url: string;
  publicId: string;
}

interface ImagesStepProps {
  imageSrc: FormValues['imageSrc'];
  setCustomValue: <K extends keyof FormValues>(
    id: K,
    value: FormValues[K]
  ) => void;
  isLoading?: boolean;
}

const ImagesStep: React.FC<ImagesStepProps> = ({
  imageSrc,
  setCustomValue,
  isLoading = false,
}) => {
  const MAX_IMAGES = 3;

  const handleImageUpload = (image: UploadedImage) => {
    if (imageSrc.length >= MAX_IMAGES) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }

    // Добавляем новое изображение к существующему массиву
    setCustomValue('imageSrc', [...imageSrc, image]);
  };

  const handleImageRemove = (publicId: string) => {
    setCustomValue(
      'imageSrc',
      imageSrc.filter((image) => image.publicId !== publicId)
    );
    toast.error('Image removed');
  };

  return (
    <div className="flex flex-col gap-8">
      <Heading
        title="Add photos of your place"
        subtitle={`Show guests what your place looks like! (${imageSrc.length}/${MAX_IMAGES})`}
      />
      <ImageUpload
        onUpload={handleImageUpload}
        onRemove={handleImageRemove}
        uploadedImages={imageSrc}
        disabled={isLoading}
        maxImages={MAX_IMAGES}
      />
    </div>
  );
};

export default ImagesStep;
