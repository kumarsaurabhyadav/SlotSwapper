import React, { useEffect, useState } from "react";

const Toast = ({ message, type = "info", onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: "bg-success",
    error: "bg-danger",
    warning: "bg-warning",
    info: "bg-info",
  }[type] || "bg-info";

  const icon = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  }[type] || "ℹ️";

  return (
    <div
      className={`toast show ${bgColor} text-white`}
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
        minWidth: "300px",
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.3s ease-out",
      }}
      role="alert"
    >
      <div className="toast-header bg-transparent text-white border-0">
        <strong className="me-auto">{icon} {type.charAt(0).toUpperCase() + type.slice(1)}</strong>
        <button
          type="button"
          className="btn-close btn-close-white"
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
        ></button>
      </div>
      <div className="toast-body">{message}</div>
    </div>
  );
};

export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default Toast;

