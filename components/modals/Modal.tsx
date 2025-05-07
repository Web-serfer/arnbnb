'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { IoMdClose } from 'react-icons/io';
import Button from '../Button'; // Убедитесь, что путь к компоненту Button верный
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
  actionIcon?: IconType; // Этот проп не используется в текущей реализации, но оставлен
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
  const modalRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }

      if (event.key === 'Tab' && modalRef.current && isOpen && showModal) {
        const focusableElements = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(
            'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => el.offsetParent !== null);

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          }
        }
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);

      if (showModal) {
        setTimeout(() => {
          if (modalRef.current) {
            const closeButton =
              modalRef.current.querySelector<HTMLButtonElement>(
                '.modal-close-button'
              );
            if (closeButton && closeButton.offsetParent !== null) {
              closeButton.focus();
            } else {
              const focusableContent = Array.from(
                modalRef.current.querySelectorAll<HTMLElement>(
                  'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
                )
              ).filter(
                (el) =>
                  el.offsetParent !== null &&
                  !el.classList.contains('modal-close-button')
              );

              if (focusableContent.length > 0) {
                focusableContent[0].focus();
              }
            }
          }
        }, 50);
      }
    } else {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, showModal, handleClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title-id' : undefined}
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
              <h3 id="modal-title-id" className="text-lg font-semibold">
                {title}
              </h3>
              <button
                className="modal-close-button absolute right-9 rounded-full p-2 transition hover:bg-neutral-100 active:scale-95"
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
              {/* Контейнер для кнопок действий */}
              <div className="flex w-full flex-col gap-2">
                {secondaryAction && secondaryActionLabel && (
                  <Button
                    outline
                    label={secondaryActionLabel}
                    onClick={secondaryAction}
                    disabled={disabled}
                    className="w-full"
                  />
                )}

                <Button
                  label={actionLabel}
                  onClick={handleSubmit}
                  disabled={disabled}
                  className="w-full"
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
