import { IconType } from 'react-icons';

interface ButtonProps {
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  outline?: boolean;
  small?: boolean;
  icon?: IconType;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled,
  outline,
  small,
  icon: Icon,
  className = '',
  type = 'button',
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        relative
        disabled:opacity-70
        disabled:cursor-not-allowed
        rounded-lg
        hover:opacity-80
        transition
        flex
        items-center
        justify-center
        gap-2
        focus:outline-none
        focus:ring-2
        focus:ring-offset-2
        ${/* Стили в зависимости от пропа 'outline' */ ''}
        ${
          outline
            ? 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50 focus:ring-neutral-400'
            : 'bg-rose-500 border-rose-500 text-white hover:bg-rose-600 focus:ring-rose-500'
        }
        ${/* Стили в зависимости от пропа 'small' */ ''}
        ${
          small
            ? 'text-sm py-1 px-2 font-light border-[1px]'
            : 'text-md py-3 px-4 font-semibold border-2'
        }
        ${className}
      `}
    >
      {/* Отображение иконки, если она передана */}
      {Icon && <Icon size={small ? 18 : 24} />}
      {label}
    </button>
  );
};

export default Button;
