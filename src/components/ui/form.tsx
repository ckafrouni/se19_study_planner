import { ReactNode } from "react";

export function Form({
  action,
  method,
  children,
  onSubmit,
}: {
  action: string;
  method: string;
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form
      className="mt-8 space-y-6"
      action={action}
      method={method}
      onSubmit={onSubmit}
    >
      {children}
    </form>
  );
}

export function FormFieldGroup({ children }: { children: React.ReactNode }) {
  return <div className="rounded-md -space-y-px">{children}</div>;
}

export function FormField({
  name,
  type,
  placeholder,
  required = false,
  className = "",
}: {
  name: string;
  type: string;
  placeholder: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <input
      name={name}
      type={type}
      required={required}
      className={`
        form-field

        appearance-none 
        relative 
        block 
        w-full 
        px-3 
        py-2

        border 
        border-neutral-300 
        placeholder-neutral-500 
        text-neutral-900 

        focus:outline-none
        focus:border-neutral-500
        focus:z-10 

        sm:text-sm 
        first-of-type:rounded-t-lg 
        last-of-type:rounded-b-lg 
        ${className}`}
      placeholder={placeholder}
    />
  );
}

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
      className={`text-xs md:text-base cursor-pointer rounded-lg hover:bg-neutral-100 px-3 py-2 ${className}`}
    >
      {children}
    </button>
  );
}
