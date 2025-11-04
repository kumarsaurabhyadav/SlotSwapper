import { useState, useCallback } from "react";

let toastId = 0;

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info") => {
    const id = toastId++;
    setToasts((prev) => [...prev, { id, message, type }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((message) => showToast(message, "success"), [showToast]);
  const error = useCallback((message) => showToast(message, "error"), [showToast]);
  const warning = useCallback((message) => showToast(message, "warning"), [showToast]);
  const info = useCallback((message) => showToast(message, "info"), [showToast]);

  return {
    toasts,
    showToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
};

