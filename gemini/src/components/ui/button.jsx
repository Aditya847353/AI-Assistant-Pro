import React from "react";
import clsx from "clsx";

const VARIANTS = {
  primary: "bg-black text-white hover:bg-gray-600",
  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-200",
  ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
  destructive: "bg-red-600 text-white hover:bg-red-700",
};

export const Button = ({
  children,
  onClick,
  className = "",
  variant = "primary",
  disabled = false,
  type = "button",
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        "inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
        VARIANTS[variant],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};