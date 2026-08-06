/**
 * Utilidades para unir clases de Tailwind (similar a clsx o tailwind-merge básico)
 */
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
