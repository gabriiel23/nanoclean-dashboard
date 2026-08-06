import React from 'react';
import { cn } from '../../lib/utils';
import { ContenedorBackend } from '../../types';

interface BinVisualizerProps {
  contenedor: ContenedorBackend;
}

export default function BinVisualizer({ contenedor }: BinVisualizerProps) {
  const { id, porcentajeLlenado, estadoCritico, estadoSensor } = contenedor;

  // Lógica de colores personalizados según la categoría del contenedor
  let fillColorClass = 'bg-gray-400 shadow-[0_0_15px_rgba(156,163,175,0.4)]'; // Gris por defecto
  let animateClass = '';

  if (id === 'sensor1') {
    // Orgánico ➔ Verde
    fillColorClass = 'bg-[#52B788] shadow-[0_0_15px_rgba(82,183,136,0.5)]';
  } else if (id === 'sensor2') {
    // Plástico ➔ Azul
    fillColorClass = 'bg-[#2563EB] shadow-[0_0_15px_rgba(37,99,235,0.5)]';
  } else if (id === 'sensor3') {
    // Papel / Cartón ➔ Gris
    fillColorClass = 'bg-[#9CA3AF] shadow-[0_0_15px_rgba(156,163,175,0.5)]';
  }

  // Alerta Crítica (>= 85%) sobrescribe el color a Rojo parpadeante
  if (porcentajeLlenado >= 85 || estadoCritico) {
    fillColorClass = 'bg-[#E63946] shadow-[0_0_20px_rgba(230,57,70,0.8)]';
    animateClass = 'animate-pulse';
  }

  // Mapeo de nombres legibles para los sensores del backend
  const sensorNames: Record<string, string> = {
    sensor1: 'sensor contenedor organico',
    sensor2: 'Sensor contenedor Plasticos',
    sensor3: 'sensor contenedor Papel/carton',
  };

  const displayName = sensorNames[id] || id;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Información Superior */}
      <div className="text-center flex flex-col items-center">
        <h3 className="font-bold text-gray-800 text-xs text-center max-w-[120px] leading-tight min-h-[32px] flex items-center justify-center">
          {displayName}
        </h3>
        <span className={cn(
          "text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block",
          estadoSensor === 'ONLINE' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
        )}>
          {estadoSensor}
        </span>
      </div>

      {/* Contenedor Físico (Bote) */}
      <div className="relative w-24 h-40 bg-gray-50 rounded-b-xl border-2 border-t-0 border-gray-200 overflow-hidden shadow-inner flex items-end">
        
        {/* Tapa del Bote */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gray-300 rounded-sm -mt-2 border-b border-gray-400" />
        
        {/* Líneas de Marca del Bote (decorativas) */}
        <div className="absolute inset-y-0 w-full flex flex-col justify-between py-4 opacity-20 pointer-events-none">
          <div className="w-full border-b border-gray-400"></div>
          <div className="w-full border-b border-gray-400"></div>
          <div className="w-full border-b border-gray-400"></div>
        </div>

        {/* Nivel de Basura (Animado) */}
        <div 
          className={cn("w-full transition-all duration-500 ease-in-out opacity-90 rounded-t-sm", fillColorClass, animateClass)}
          style={{ height: `${Math.min(Math.max(porcentajeLlenado, 0), 100)}%` }}
        />
        
        {/* Etiqueta de Porcentaje en el centro */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-sm font-bold text-gray-800 bg-white/70 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm">
            {porcentajeLlenado.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}
