import { useCallback } from "react";

export const useToast = () => {
  const showToast = useCallback(({ title, description, variant = "default" }) => {
    const event = new CustomEvent("app-toast", {
      detail: { title, description, variant },
    });
    window.dispatchEvent(event);
  }, []);

  return {
    toast: showToast,
  };
};