import { ReactNode } from 'react'

export function ButtonLink({
  href,
  children,
  className,
}: {
  href: string
  children: ReactNode
  className?: string
}) {
  return (
    <a
      href={href}
      className={`cursor-pointer rounded-lg px-3 py-2 text-xs hover:bg-gray-100 md:text-base ${className}`}
    >
      {children}
    </a>
  )
}
