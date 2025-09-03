import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import "./modal.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  buttons?: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children, buttons }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.addEventListener("close", onClose);
    return () => {
      dialog.removeEventListener("close", onClose);
    };
  }, [onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (dialogRef.current === event.target) {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <dialog ref={dialogRef} onClick={handleBackdropClick} className="modal">
      <div className="modal-content">
        {title && <h2 className="modal-title">{title}</h2>}
        <div className="modal-body">{children}</div>
        {buttons && <div className="modal-footer">{buttons}</div>}
      </div>
    </dialog>,
    document.getElementById("modal-root")!
  );
}