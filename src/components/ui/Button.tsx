import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "px-4 py-2 rounded-lg font-medium transition focus:outline-none";

  const variantStyles =
    variant === "primary"
      ? "bg-black text-white hover:bg-gray-800"
      : "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-neutral-700 dark:text-white";

  return (
    <button className={`${baseStyles} ${variantStyles} ${className}`} {...props}>
      {children}
    </button>
  );
}
