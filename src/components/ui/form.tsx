import { ReactNode } from "react";

export function FormButton({
  children,
  className,
  type,
}: {
  children: ReactNode;
  className?: string;
  type?: "submit" | "reset" | "button";
}) {
  return (
    <button
      type={type}
      className={`cursor-pointer rounded-lg hover:bg-gray-100 px-3 py-2 ${className}`}
    >
      {children}
    </button>
  );
}
