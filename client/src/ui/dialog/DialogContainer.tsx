import {type DialogType, useDialog} from "@/contexts";
import {Button} from "@/ui";

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
    <div className="fixed inset-0 z-[1000] center bg-black/50">
      <div className="w-[90%] max-w-[400px] animate-fade-in rounded-2xl border-2 border-honey bg-base p-8 text-center shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
        <div className="mb-6">
          <h2 className="mb-2.5 text-2xl text-coffee">
            {dialog.type === 'confirm' ? '확인' : '알림'}
          </h2>
          <p className="text-[#666] leading-normal">{dialog.message}</p>
        </div>
        <div className="center gap">
          {dialog.type === 'confirm' && (
            <Button color="pink" onClick={handleCancel}>
              취소
            </Button>
          )}
          <Button color="green" onClick={handleConfirm}>
            확인
          </Button>
        </div>
      </div>
    </div>
  );
};