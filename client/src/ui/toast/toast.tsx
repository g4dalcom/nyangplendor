import {memo} from "react";
import {ToastContainer} from "react-toastify";
import "./toast.css";

export const Toast = memo(() => {
  return (
    <ToastContainer
      className="toast"
      containerId="toast-message"
      position="top-center"
      autoClose={500}
      hideProgressBar
      newestOnTop
      closeOnClick
      pauseOnFocusLoss
      limit={1}
      closeButton={false}
    />
  )
})