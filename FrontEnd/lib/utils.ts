import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getStaticUrl(url: string | null | undefined): string {
  if (!url) return ''
  const prefix = process.env.NEXT_PUBLIC_STATIC_PREFIX ?? ''
  if (prefix && url.startsWith(prefix)) return url
  return prefix + url
}
