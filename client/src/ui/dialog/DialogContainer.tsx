import {type DialogType, useDialog} from "@/contexts";
import "./Dialog.css";

export const DialogContainer = () => {
  const { dialog, closeDialog } = useDialog();

  if (!dialog.isOpen) {
    return null;
  }

  const dialogType: DialogType = dialog.type as DialogType;

  const handleConfirm = () => {
    if (dialogType === 'confirm') {
      dialog.onConfirm && dialog.onConfirm();
    } else {
      closeDialog();
    }
  };

  const handleCancel = () => {
    if (dialogType === 'confirm' && dialog.onCancel) {
      dialog.onCancel();
    } else {
      closeDialog();
    }
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-container">
        <div className="dialog-content">
          <h2 className="dialog-header">
            {dialog.type === 'confirm' ? '확인' : '알림'}
          </h2>
          <p className="dialog-body">{dialog.message}</p>
        </div>
        <div className="dialog-footer horizontal">
          {dialog.type === 'confirm' && (
            <button className="bubbly pink" onClick={handleCancel}>취소</button>
          )}
          <button
            className="bubbly green"
            onClick={handleConfirm}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
};