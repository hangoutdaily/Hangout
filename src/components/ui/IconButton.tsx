import { ButtonHTMLAttributes, ReactNode } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  className?: string;
}

export default function IconButton({ icon, className = "", ...props }: IconButtonProps) {
  return (
    <button
      className={`p-2 rounded-full hover:bg-gray-100 transition ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
}
