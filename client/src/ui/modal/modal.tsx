import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import "./modal.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  size?: 'sm' | 'md' | 'lg' | 'card' | 'tile';
  variant?: 'default' | 'card' | 'tile';
  className?: string;
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({ isOpen, onClose, size = 'md', variant = 'default', className = '', children, header, footer }: ModalProps) {
  const ref = useRef<HTMLDialogElement | null>(null);
  const modalClassName = `modal-container size-${size} variant-${variant} ${className}`.trim();

  const close = () => {
    ref.current?.close()
    onClose()
  }

  useEffect(() => {
    if (isOpen) {
      ref.current?.showModal()
    } else {
      close()
    }
  }, [isOpen])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "Escape") {
      close()
    }
  }

  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (ref.current === event.target) {
      onClose();
    }
  };

  return ReactDOM.createPortal(
      <dialog
        ref={ref}
        onCancel={onClose}
        onKeyDown={handleKeyDown}
        onClick={handleBackdropClick}
        className={modalClassName}
      >
        <div className="modal-content">
          {header && (
            <header className="modal-header">
              {header}
            </header>
          )}
          <main className="modal-body">{children}</main>
          {footer && <footer className="modal-footer">{footer}</footer>}
        </div>
      </dialog>,
      document.getElementById('modal-root')!
    );
}