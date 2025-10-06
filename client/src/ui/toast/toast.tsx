import { memo } from "react";
import { ToastContainer } from "react-toastify";

export const Toast = memo(() => {
  return (
    <ToastContainer
      containerId="toast-message"
      position="top-center"
      autoClose={500}
      hideProgressBar
      newestOnTop
      closeOnClick
      pauseOnFocusLoss
      limit={1}
      closeButton={false}
      className="w-auto pointer-events-none z-[1040]"
      toastClassName="!p-0 !m-0 !rounded-xl border-2 border-coffee !bg-primary shadow-clickable"
    />
  )
})