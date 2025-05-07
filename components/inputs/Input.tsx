'use client';

import React, {
  InputHTMLAttributes,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { FieldValues, UseFormRegister } from 'react-hook-form';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  type?: React.HTMLInputTypeAttribute;
  error?: string;
  disabled?: boolean;
  formatPrice?: boolean;
  required?: boolean;
  register?: UseFormRegister<FieldValues>;
  validation?: object;
  isError?: boolean;
  pattern?: { value: RegExp; message: string };
  minLength?: { value: number; message: string };
}

const Input: React.FC<InputProps> = ({
  label,
  id,
  type = 'text',
  error,
  disabled,
  formatPrice,
  register,
  validation,
  isError,
  pattern,
  minLength,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    if (inputRef.current?.value === '') {
      setIsFocused(false);
    }
  }, []);

  useEffect(() => {
    if (inputRef.current?.value) {
      setIsFocused(true);
    }
  }, []);

  const hasError = !!error || !!isError;

  useEffect(() => {
    console.log(`Input ${id} Props:`, { error, isError, hasError });
  }, [error, isError, id, hasError]);

  return (
    <div className="relative w-full">
      {/* Label */}
      {label && (
        <label
          htmlFor={id}
          className={`absolute left-4 top-5 z-10 origin-[0] transform text-sm transition-all duration-200 ease-in-out ${
            isFocused ? '-translate-y-4 scale-75 text-black' : 'scale-100'
          } ${formatPrice ? 'left-9' : 'left-4'} ${
            hasError ? 'text-rose-500' : 'text-zinc-400'
          }`}
        >
          {label}
        </label>
      )}
      {/* Input */}
      <input
        id={id}
        type={type}
        disabled={disabled}
        ref={inputRef}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`peer w-full rounded-md border-2 bg-white p-4 pt-6 font-light outline-none transition disabled:cursor-not-allowed disabled:opacity-70 ${formatPrice ? 'pl-9' : 'pl-4'} ${
          hasError
            ? 'border-rose-500 focus:border-rose-500'
            : 'border-neutral-300 focus:border-black'
        }`}
        {...(register
          ? register(id, {
              ...validation,
              pattern: pattern?.value,
              minLength: minLength?.value,
            })
          : {})}
        {...props}
      />
      {/* Error Message */}
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
