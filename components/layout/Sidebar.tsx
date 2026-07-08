'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Leaf, LayoutDashboard, Component, Bell, Settings, Cpu, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: 'Clasificación',
      href: '/clasificacion',
      icon: <Component className="w-5 h-5" />,
    },
    {
      name: 'Alertas',
      href: '/alertas',
      icon: <Bell className="w-5 h-5" />,
      hasNotification: true,
    },
    {
      name: 'Nodos',
      href: '/nodos',
      icon: <Cpu className="w-5 h-5" />,
    },
  ];

  return (
    <aside className="w-[240px] h-full bg-white border-r border-gray-100 flex flex-col">
      {/* Logo + botón de cierre (solo visible en mobile) */}
      <div className="p-6 pb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Leaf className="w-6 h-6 text-[#1B4332]" fill="currentColor" />
          <span className="text-[#1B4332] font-bold text-xl tracking-tight">ÑañoClean</span>
        </div>
        {/* Botón cerrar: solo visible en móvil */}
        <button
          onClick={onClose}
          className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-400"
          aria-label="Cerrar menú"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-xl transition-colors text-sm font-medium",
                isActive
                  ? "bg-[#52B788]/20 text-[#1B4332]"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              )}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.name}</span>
              </div>
              {item.hasNotification && (
                <span className="w-2 h-2 rounded-full bg-[#E63946]"></span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Ajustes al fondo */}
      <div className="p-4 mb-4">
        <Link
          href="/ajustes"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium",
            pathname === '/ajustes'
              ? "bg-[#52B788]/20 text-[#1B4332]"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
          )}
        >
          <Settings className="w-5 h-5" />
          <span>Ajustes</span>
        </Link>
      </div>
    </aside>
  );
}
