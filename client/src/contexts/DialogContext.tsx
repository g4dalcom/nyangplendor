import {createContext, useContext, useState, useCallback, type ReactNode} from 'react';
import {DialogContainer} from "@/components/dialog/DialogContainer.tsx";

export type DialogType = 'alert' | 'error' | 'confirm';

type Dialog = {
  isOpen: boolean;
  message: string;
  type: DialogType | null;
  onConfirm: (() => void) | null;
  onCancel: (() => void) | null;
}

type DialogContextProps = {
  dialog: Dialog;
  alert: (message: string) => void;
  error: (message: string) => void;
  confirm: (message: string, onConfirm: () => void, onCancel?: () => void) => void;
  closeDialog: () => void;
}

const DialogContext = createContext<DialogContextProps | undefined>(undefined);

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [dialog, setDialog] = useState<Dialog>({
    isOpen: false,
    message: '',
    type: null,
    onConfirm: null,
    onCancel: null,
  });

  const closeDialog = useCallback(() => {
    setDialog(prev => ({ ...prev, isOpen: false }));
  }, []);

  const openDialog = useCallback(
    (type: DialogType, message: string, onConfirm: (() => void) | null = null, onCancel: (() => void) | null = null) => {
      const resolvedOnConfirm = type === 'confirm'
        ? (onConfirm ? () => { onConfirm(); closeDialog(); } : null)
        : closeDialog;

      const resolvedOnCancel = onCancel ? () => { onCancel(); closeDialog(); } : closeDialog;

      Promise.resolve().then(() => {
        setDialog({
          isOpen: true,
          type,
          message,
          onConfirm: resolvedOnConfirm,
          onCancel: resolvedOnCancel,
        });
      });
    },
    [closeDialog]
  );


  const alert = useCallback((message: string) => openDialog("alert", message), [openDialog]);
  const error = useCallback((message: string) => openDialog("error", message), [openDialog]);
  const confirm = useCallback(
    (message: string, onConfirm: () => void, onCancel?: () => void) =>
      openDialog("confirm", message, onConfirm, onCancel),
    [openDialog]
  );

  const value = { dialog, alert, error, confirm, closeDialog };

  return (
    <DialogContext.Provider value={value}>
      <DialogContainer />
      {children}
    </DialogContext.Provider>
  );
};

export const useDialog = () => useContext(DialogContext) as DialogContextProps;