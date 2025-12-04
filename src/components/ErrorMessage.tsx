import { useEffect, useState } from "react";

interface ErrorMessageProps {
  message: string | null;
  onDismiss: () => void;
}

export function ErrorMessage({ message, onDismiss }: ErrorMessageProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timeout = setTimeout(() => {
        setVisible(false);
        setTimeout(onDismiss, 300);
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [message, onDismiss]);

  if (!message) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-[100px] left-1/2 -translate-x-1/2 z-[300] bg-[#ff4444] text-white px-6 py-3 rounded-lg text-sm transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {message}
    </div>
  );
}
