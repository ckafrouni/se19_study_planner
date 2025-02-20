import { Html } from "@elysiajs/html";

export function ButtonLink({
  href,
  children,
  class: className,
}: {
  href: string;
  children: JSX.Element;
  class?: string;
}) {
  return (
    <a
      href={href}
      class={`cursor-pointer rounded-lg hover:bg-gray-100 px-3 py-2 ${className}`}
    >
      {children}
    </a>
  );
}
