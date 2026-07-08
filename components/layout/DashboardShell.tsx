'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Cierra el sidebar en mobile cuando se navega a otra ruta
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F7F5] font-sans">

      {/* ── Backdrop (solo mobile) ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      {/*
        Desktop (lg+): siempre visible, estático en el flujo normal.
        Mobile/tablet:  fixed, se desliza desde la izquierda vía transform.
      */}
      <div
        className={[
          // Posición y tamaño
          'w-[240px] flex-shrink-0 z-40 h-full',
          // Desktop: estático, visible por default
          'lg:static lg:translate-x-0',
          // Mobile: fixed overlay, se anima
          'fixed inset-y-0 left-0 transition-transform duration-300 ease-in-out lg:transition-none',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* ── Contenido principal ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Navbar onMenuToggle={() => setSidebarOpen((o) => !o)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}
