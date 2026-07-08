/**
 * Utilidades para unir clases de Tailwind (similar a clsx o tailwind-merge básico)
 */
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
