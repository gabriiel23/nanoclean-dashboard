'use client';

import dynamic from 'next/dynamic';
import { Contenedor } from '../../types';

const ContainerMap = dynamic(
  () => import('./ContainerMap'),
  {
    ssr: false,
    loading: () => (
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 h-[500px] flex items-center justify-center">
        <p className="text-gray-400 text-sm font-medium animate-pulse">Cargando mapa…</p>
      </div>
    ),
  }
);

export default function MapWrapper({ contenedores }: { contenedores: Contenedor[] }) {
  return <ContainerMap contenedores={contenedores} />;
}
