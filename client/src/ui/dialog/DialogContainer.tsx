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
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-content">
          <h2 className="modal-header">
            {dialog.type === 'confirm' ? '확인' : '알림'}
          </h2>
          <p className="modal-body">{dialog.message}</p>
        </div>
        <div className="modal-footer horizontal">
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