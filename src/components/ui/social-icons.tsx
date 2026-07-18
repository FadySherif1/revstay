import type { SVGProps } from "react";

export function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6.5 8.5v9" />
      <path d="M6.5 5.25a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
      <path d="M10.5 17.5v-5.25a2.75 2.75 0 0 1 5.5 0v5.25" />
      <path d="M10.5 10.5v7" />
    </svg>
  );
}

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M14.5 21v-7.5h2.5l.5-3h-3V8.25c0-.9.3-1.5 1.65-1.5H17.5V3.6C17.2 3.55 16.2 3.5 15.05 3.5c-2.4 0-4.05 1.45-4.05 4.15V10.5H8.5v3H11V21" />
    </svg>
  );
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="16.7" cy="7.3" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
