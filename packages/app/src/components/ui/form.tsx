import { ReactNode } from 'react'

export function Form({
  action,
  method,
  children,
  onSubmit,
  className,
}: {
  action: string
  method: string
  children: React.ReactNode
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
  className?: string
}) {
  return (
    <form
      className={`mt-8 space-y-6 ${className}`}
      action={action}
      method={method}
      onSubmit={onSubmit}
    >
      {children}
    </form>
  )
}

export function FormFieldGroup({ children }: { children: React.ReactNode }) {
  return <div className="-space-y-px rounded-md">{children}</div>
}

export function FormField({
  name,
  type,
  placeholder,
  required = false,
  className = '',
  defaultValue,
  value,
}: {
  name: string
  type: string
  placeholder: string
  required?: boolean
  className?: string
  defaultValue?: string
  value?: string
}) {
  return (
    <input
      name={name}
      type={type}
      required={required}
      className={`form-field relative block w-full appearance-none border border-neutral-300 px-3 py-2 text-neutral-900 placeholder-neutral-500 first-of-type:rounded-t-lg last-of-type:rounded-b-lg focus:z-10 focus:border-neutral-500 focus:outline-none sm:text-sm ${className}`}
      placeholder={placeholder}
      defaultValue={defaultValue}
      value={value}
    />
  )
}

export function FormButton({
  children,
  className,
  type,
}: {
  children: ReactNode
  className?: string
  type?: 'submit' | 'reset' | 'button'
}) {
  return (
    <button
      type={type}
      className={`cursor-pointer rounded-lg px-3 py-2 text-xs hover:bg-neutral-100 md:text-base ${className}`}
    >
      {children}
    </button>
  )
}
