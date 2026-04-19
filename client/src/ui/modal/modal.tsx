import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";

const modalContainerVariants = cva(
  "relative w-[90vw] m-auto border-none shadow-[0_10px_30px_rgba(0,0,0,0.2)] p-0 bg-transparent pointer-events-auto opacity-0 scale-95 transition-all duration-200 ease-in-out",
  {
    variants: {
      isOpen: {
        true: "opacity-100 scale-100",
      },
      size: {
        sm: "max-w-[400px]",
        md: "max-w-[600px]",
        lg: "max-w-[800px]",
        card: "max-w-80 aspect-[3/4.5]",
        tile: "max-w-120 aspect-square",
      },
      variant: {
        default: "",
        card: "shadow-none",
        tile: "",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
);

const modalContentVariants = cva("w-full h-full flex flex-col overflow-hidden", {
  variants: {
    variant: {
      default: "bg-white text-ui-text-main",
      card: "bg-transparent text-ui-text-light",
      tile: "bg-transparent text-ui-text-light",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const headerVariants = cva("flex justify-between items-center px-6 py-4 flex-shrink-0", {
  variants: {
    variant: {
      default: "border-b border-ui-border-light text-[1.2rem] font-semibold",
      card: "bg-ui-bg-dark border-b border-ui-border-medium text-[1.3rem]",
      tile: "hidden",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const bodyVariants = cva("px-6 py-6 flex-grow overflow-y-auto", {
  variants: {
    size: {
      default: "",
      sm: "",
      md: "",
      lg: "",
      card: "p-0",
      tile: "p-0"
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const footerVariants = cva("flex justify-end gap-4 px-6 py-4 flex-shrink-0", {
  variants: {
    variant: {
      default: "",
      card: "bg-ui-bg-dark border-t border-ui-border-medium",
      tile: "hidden",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});


interface ModalProps extends Omit<VariantProps<typeof modalContainerVariants>, 'isOpen'> {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({ isOpen, onClose, size, variant, className, children, header, footer }: ModalProps) {
  const ref = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [isOpen]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    }
  };

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
      className={clsx(modalContainerVariants({ isOpen, size, variant }), className)}
    >
      <div className={clsx(modalContentVariants({ variant }))} style={{ borderRadius: 'var(--radius-md)' }}>
        {header && (
          <header className={headerVariants({ variant })}>
            {header}
          </header>
        )}
        <main className={bodyVariants({ size })}>{children}</main>
        {footer && <footer className={footerVariants({ variant })}>{footer}</footer>}
      </div>
    </dialog>,
    document.getElementById('modal-root')!
  );
}