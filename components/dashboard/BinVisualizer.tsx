import React from 'react';
import { cn } from '../../lib/utils';
import { ContenedorBackend } from '../../types';

interface BinVisualizerProps {
  contenedor: ContenedorBackend;
}

export default function BinVisualizer({ contenedor }: BinVisualizerProps) {
  const { id, porcentajeLlenado, estadoCritico, estadoSensor } = contenedor;

  // Lógica de colores neón según el porcentaje
  let fillColorClass = 'bg-green-400 shadow-[0_0_15px_rgba(74,222,128,0.5)]'; // Verde neón para < 50%
  let animateClass = '';

  if (porcentajeLlenado >= 80 || estadoCritico) {
    fillColorClass = 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)]'; // Rojo brillante para >= 80%
    animateClass = 'animate-pulse';
  } else if (porcentajeLlenado >= 50) {
    fillColorClass = 'bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]'; // Amarillo para 50% - 79%
  }

  // Si está offline, se muestra gris
  if (estadoSensor === 'OFFLINE') {
    fillColorClass = 'bg-gray-400';
    animateClass = '';
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Información Superior */}
      <div className="text-center">
        <h3 className="font-bold text-gray-800">{id}</h3>
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
