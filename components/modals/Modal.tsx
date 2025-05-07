'use client';

import { useCallback, useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import Button from '../Button';
import { IconType } from 'react-icons';

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void;
  title?: string;
  body: React.ReactElement;
  footer?: React.ReactElement;
  actionLabel: string;
  disabled?: boolean;
  secondaryAction?: () => void;
  secondaryActionLabel?: string;
  actionIcon?: IconType;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  body,
  actionLabel,
  footer,
  disabled,
  secondaryAction,
  secondaryActionLabel,
}) => {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  const handleSubmit = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      onSubmit(e);
    },
    [disabled, onSubmit]
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-neutral-800/70 outline-none focus:outline-none"
      onClick={handleClose}
    >
      <div
        className="relative mx-auto my-6 max-h-[90vh] w-11/12 md:w-4/6 lg:w-3/6 xl:w-2/5"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`transform transition-all duration-300 ${
            showModal
              ? 'translate-y-0 opacity-100'
              : 'translate-y-full opacity-0'
          }`}
        >
          <div className="relative flex max-h-[90vh] flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
            {/* Header */}
            <div className="relative flex items-center justify-center rounded-t border-b-[1px] p-6">
              <h3 className="text-lg font-semibold">{title}</h3>
              <button
                className="absolute right-9 rounded-full p-2 transition hover:bg-neutral-100 active:scale-95"
                onClick={handleClose}
                aria-label="Close"
              >
                <IoMdClose size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="relative flex-auto overflow-y-auto p-6">{body}</div>

            {/* Footer */}
            <div className="flex flex-col gap-2 p-6">
              <div className="flex w-full items-center justify-end gap-4">
                {secondaryAction && secondaryActionLabel && (
                  <Button
                    outline
                    label={secondaryActionLabel}
                    onClick={secondaryAction}
                    disabled={disabled}
                  />
                )}
                <Button
                  label={actionLabel}
                  onClick={handleSubmit}
                  disabled={disabled}
                />
              </div>
              {footer}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
