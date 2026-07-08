import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { Contenedor } from '../../types';
import { cn } from '../../lib/utils';

interface ContainerCardProps {
  contenedor: Contenedor;
}

export default function ContainerCard({ contenedor }: ContainerCardProps) {
  const { id, ubicacion, nivelLlenado, estado, requiereRecoleccion } = contenedor;

  let colorTheme = {
    bar: 'bg-[#52B788]',
    badgeBg: 'bg-[#52B788]/20',
    badgeText: 'text-[#1B4332]',
    cardBg: 'bg-white',
    cardBorder: 'border-gray-50'
  };

  if (nivelLlenado >= 85 || requiereRecoleccion) {
    colorTheme = {
      bar: 'bg-[#E63946]',
      badgeBg: 'bg-[#E63946]/20',
      badgeText: 'text-[#E63946]',
      cardBg: 'bg-[#FFF5F5]',
      cardBorder: 'border-[#FFD6D6]'
    };
  } else if (nivelLlenado >= 60) {
    colorTheme = {
      bar: 'bg-[#F4A261]',
      badgeBg: 'bg-[#F4A261]/20',
      badgeText: 'text-[#D97706]',
      cardBg: 'bg-white',
      cardBorder: 'border-gray-50'
    };
  }

  return (
    <Link href={`/contenedores/${id}`} className="block transition-all hover:-translate-y-1 hover:shadow-md rounded-3xl">
      <div className={cn(
        "relative p-5 rounded-3xl shadow-sm border flex overflow-hidden h-full",
        colorTheme.cardBg,
        colorTheme.cardBorder
      )}>
        {requiereRecoleccion && (
          <div className="absolute top-0 right-0 bg-[#E63946] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl z-10">
            LLENO
          </div>
        )}

        <div className="w-4 h-full bg-gray-100 rounded-full mr-4 flex flex-col justify-end overflow-hidden">
          <div 
            className={cn("w-full rounded-full transition-all duration-500", colorTheme.bar)} 
            style={{ height: `${nivelLlenado}%` }}
          />
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">{id}</h3>
            <span className={cn("px-2.5 py-0.5 rounded-md text-sm font-bold", colorTheme.badgeBg, colorTheme.badgeText)}>
              {nivelLlenado}%
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-gray-500 mb-3">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">{ubicacion}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className={cn(
              "w-2 h-2 rounded-full",
              estado === 'ONLINE' ? "bg-[#52B788]" : "bg-gray-400"
            )}></span>
            <span className="text-[11px] font-bold text-gray-500 tracking-wider">
              {estado}
            </span>
          </div>

          {requiereRecoleccion && (
            <div className="mt-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E63946]"></span>
              <span className="text-xs font-bold text-[#E63946] uppercase tracking-wide">Requiere Recolección</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
