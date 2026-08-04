'use client';

import { usePathname } from 'next/navigation';
import { Bell, Menu, Globe } from 'lucide-react';
import Link from 'next/link';

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/dashboard':                     { title: 'Panel de Control', subtitle: 'Loja, Ecuador · Actualizado ahora' },
  '/clasificacion':                 { title: 'Clasificación', subtitle: 'Cámara de clasificación YOLOv8' },
  '/dashboard/clasificaciones-stats': { title: 'Clasificaciones', subtitle: 'Estadísticas del clasificador' },
  '/dashboard/alertas':             { title: 'Alertas', subtitle: 'Historial de eventos del sistema' },
  '/dashboard/contenedores':        { title: 'Flota de Contenedores', subtitle: 'Todos los contenedores registrados' },
  '/dashboard/ajustes':             { title: 'Ajustes', subtitle: 'Configuración del sistema' },
};

interface NavbarProps {
  onMenuToggle?: () => void;
}

export default function Navbar({ onMenuToggle }: NavbarProps) {
  const pathname = usePathname();
  const page = PAGE_TITLES[pathname] ?? { title: 'ÑañoClean', subtitle: '' };

  return (
    <header className="h-[64px] flex-shrink-0 flex items-center justify-between px-4 sm:px-8 bg-white border-b border-gray-100">
      <div className="flex items-center gap-3">
        {/* Hamburger: solo visible en mobile/tablet */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-baseline gap-2">
          <h1 className="text-[17px] font-bold text-gray-900 tracking-tight">{page.title}</h1>
          {page.subtitle && (
            <span className="text-[13px] text-gray-400 font-normal hidden md:block">{page.subtitle}</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-[#52B788] hover:text-[#1B4332] transition-colors"
          aria-label="Ir al sitio web"
        >
          <Globe className="w-4 h-4" />
          <span className="text-xs font-semibold">Sitio web</span>
        </Link>
        <Link
          href="/dashboard/alertas"
          className="relative w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Ver alertas"
        >
          <Bell className="w-4 h-4 text-gray-500" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#E63946] border-2 border-white" />
        </Link>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#52B788]/10 border border-[#52B788]/20">
          <span className="w-2 h-2 rounded-full bg-[#52B788] animate-pulse" />
          <span className="text-xs font-semibold text-[#1B4332] hidden sm:block">Online</span>
        </div>
      </div>
    </header>
  );
}
