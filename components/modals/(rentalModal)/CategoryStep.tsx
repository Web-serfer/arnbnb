import { categoriesData } from '../../navbar/(categories)/categoriesData';
import CategoryInput from '../../inputs/CategoryInput';
import Heading from '../../Heading';
import { FieldError } from 'react-hook-form';

interface CategoryStepProps {
  category: string;
  error?: FieldError;
  setCustomValue: (id: 'category', value: string) => void; // Исправлены типы
}

const CategoryStep: React.FC<CategoryStepProps> = ({
  category,
  error,
  setCustomValue,
}) => {
  return (
    <div className="flex flex-col gap-8">
      <Heading
        title="Which of these best describes your place?"
        subtitle="Pick a category"
      />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {categoriesData.map((item) => (
          <CategoryInput
            key={item.id}
            label={item.label}
            icon={item.icon}
            onClick={() => setCustomValue('category', item.label)}
            selected={category === item.label}
          />
        ))}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

export default CategoryStep;
