'use client';

import { useRouter, usePathname } from 'next/navigation';
import { FiAlertCircle, FiFilter } from 'react-icons/fi';
import Button from './Button';

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  showReset?: boolean;
  resetLabel?: string;
  icon?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No results found',
  subtitle = 'Try adjusting your search or filters',
  showReset = false,
  resetLabel = 'Reset all filters',
  icon,
  className = '',
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleReset = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push(pathname || '/');
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 h-[60vh] p-4 text-center ${className}`}
      aria-live="polite"
      role="status"
    >
      <div className="text-rose-500 text-5xl">
        {icon || <FiAlertCircle aria-hidden="true" />}
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
        {subtitle && (
          <p className="text-gray-500 max-w-md mx-auto">{subtitle}</p>
        )}
      </div>

      {showReset && (
        <Button
          label={resetLabel}
          onClick={handleReset}
          icon={FiFilter}
          outline={false}
          small={true}
          className="w-auto px-6 py-2"
        />
      )}
    </div>
  );
};

export default EmptyState;
