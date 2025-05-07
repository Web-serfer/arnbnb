'use client';

import Image from 'next/image';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { toast } from 'react-hot-toast';
import uploadImg from '../../public/images/upload_img.png';

type CloudinaryUploadResultInfo = {
  secure_url: string;
  public_id: string;
};

type CloudinaryUploadResult = {
  event: string;
  info: CloudinaryUploadResultInfo;
};

const CldUploadWidget = dynamic(
  () => import('next-cloudinary').then((mod) => mod.CldUploadWidget),
  { ssr: false }
);

interface UploadedImage {
  url: string;
  publicId: string;
}

interface ImageUploadProps {
  onUpload: (image: UploadedImage) => void;
  onRemove?: (publicId: string) => void;
  uploadedImages: UploadedImage[];
  disabled?: boolean;
  maxImages?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onUpload,
  onRemove,
  uploadedImages,
  disabled = false,
  maxImages = 3,
}) => {
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const remainingUploads = maxImages - uploadedImages.length;

  const handleUploadResult = (result: CloudinaryUploadResult) => {
    if (result.event !== 'success') return;

    const info = result.info;
    if (info.secure_url && info.public_id) {
      onUpload({
        url: info.secure_url,
        publicId: info.public_id,
      });
      toast.success('Image uploaded');
    }
  };

  const handleRemove = (publicId: string) => {
    if (onRemove && !disabled) {
      onRemove(publicId);
    }
  };

  const isUploadDisabled = disabled || uploadedImages.length >= maxImages;

  return (
    <div className="space-y-6">
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        options={{
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          multiple: false,
          maxFiles: remainingUploads,
          maxImageFileSize: 5242880,
          resourceType: 'image',
          clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif'],
          cropping: false,
          sources: ['local', 'camera'],
        }}
        onSuccess={handleUploadResult}
        onProgress={({ progress }: { progress: { percent: number } }) => {
          setUploadProgress(progress.percent);
        }}
        onError={(error: Error) => {
          console.error('Upload error:', error);
          setUploadProgress(null);
          toast.error('Upload failed');
        }}
      >
        {({ open }) => (
          <div
            onClick={() => !isUploadDisabled && open?.()}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 p-6 text-neutral-600 transition hover:border-neutral-400 hover:bg-neutral-50 ${
              isUploadDisabled ? 'pointer-events-none opacity-50' : ''
            }`}
          >
            <Image
              src={uploadImg}
              alt="Upload"
              width={50}
              height={50}
              className="mb-4"
              priority
            />
            <p className="text-lg font-semibold">
              {uploadedImages.length < maxImages
                ? `Add photo (${remainingUploads} remaining)`
                : 'Maximum photos uploaded'}
            </p>
            <p className="text-sm text-neutral-500">
              {uploadedImages.length}/{maxImages} photos uploaded
            </p>
            {uploadProgress !== null && (
              <p className="mt-2 text-sm text-blue-500">
                Uploading... {uploadProgress.toFixed(0)}%
              </p>
            )}
          </div>
        )}
      </CldUploadWidget>

      {uploadedImages.length > 0 && (
        <div>
          <h3 className="mb-2 text-lg font-semibold">Uploaded Photos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {uploadedImages.map((image, index) => (
              <div key={image.publicId} className="relative aspect-square">
                <Image
                  src={image.url}
                  alt={`Uploaded ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                  width={200}
                  height={200}
                />
                {onRemove && (
                  <button
                    onClick={() => handleRemove(image.publicId)}
                    className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full p-1 backdrop-blur-sm"
                    aria-label="Delete image"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-lg bg-neutral-50 p-4">
        <h3 className="mb-2 text-sm font-semibold">Photo Requirements:</h3>
        <ul className="list-disc pl-5 text-xs text-neutral-600 space-y-1">
          <li>Maximum {maxImages} photos</li>
          <li>JPEG/PNG format (up to 5MB each)</li>
          <li>Show key features and angles</li>
          <li>No watermarks or text overlays</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageUpload;
