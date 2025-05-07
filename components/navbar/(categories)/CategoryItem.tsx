'use client';

import Link from 'next/link';
import qs from 'query-string';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

interface CategoryItemProps {
  category: {
    id: string;
    icon: React.ComponentType;
    label: string;
    description: string;
    count?: number;
  };
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category }) => {
  const params = useSearchParams();
  const IconComponent = category.icon;

  // Мемоизированные вычисления URL
  const [isSelected, url] = useMemo(() => {
    const currentQuery = qs.parse(params.toString());
    const selected = params?.get('category') === category.id;

    const updatedQuery = {
      ...currentQuery,
      category: selected ? undefined : category.id,
    };

    return [
      selected,
      qs.stringifyUrl({ url: '/', query: updatedQuery }, { skipNull: true }),
    ];
  }, [params, category.id]);

  return (
    <Link
      href={url}
      className={`group flex min-w-fit cursor-pointer flex-col items-center rounded-lg px-3 py-2 transition-all duration-300 ${
        isSelected
          ? 'border-primary text-primary border-b-2 bg-blue-50'
          : 'text-gray-500 hover:bg-gray-50'
      }`}
      aria-label={`Filter by ${category.label} category`}
    >
      <div className="relative flex flex-col items-center">
        <IconComponent
          className={`mb-1 text-2xl transition-colors duration-300 ${
            isSelected
              ? 'text-primary'
              : 'group-hover:text-primary text-gray-500'
          }`}
        />
        <span className="group-hover:text-primary text-xs font-medium">
          {category.label}
        </span>

        {category.count && (
          <span className="bg-primary absolute -right-2 -top-1 rounded-full px-1.5 py-0.5 text-[10px] text-white">
            {category.count}
          </span>
        )}
      </div>
    </Link>
  );
};

export default CategoryItem;
