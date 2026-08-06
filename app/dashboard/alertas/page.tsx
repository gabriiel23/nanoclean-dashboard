'use client';

import { useState, useEffect } from 'react';
import { cn, BACKEND_URL } from '../../../lib/utils';

interface Alerta {
  id: number;
  contenedorId: string;
  tipo: string;
  ubicacion: string;
  estado: string;
  fecha: string;
}

export default function AlertasPage() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [filtro, setFiltro] = useState<'TODAS' | 'PENDIENTE' | 'RESUELTA'>('TODAS');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlertas();
  }, []);

  const fetchAlertas = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/alertas`);
      const data = await res.json();
      if (!res.ok || !Array.isArray(data)) {
        throw new Error(data.error || 'No se pudieron cargar las alertas');
      }
      setAlertas(data);
    } catch (error) {
      console.error('Error obteniendo alertas:', error);
    } finally {
      setLoading(false);
    }
  };

  const resolverAlerta = async (id: number) => {
    try {
      await fetch(`${BACKEND_URL}/api/alertas/${id}/resolver`, {
        method: 'PUT'
      });
      // Actualizar la lista local
      setAlertas(alertas.map(a => a.id === id ? { ...a, estado: 'RESUELTA' } : a));
    } catch (error) {
      console.error('Error al resolver alerta:', error);
    }
  };

  const alertasFiltradas = alertas.filter((alerta) => {
    if (filtro === 'TODAS') return true;
    return alerta.estado === filtro;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Alertas del Sistema</h1>
          <p className="text-gray-500 text-sm mt-1">
            Visualiza y gestiona las alertas de llenado, desconexión y fallos en la red de contenedores.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFiltro('TODAS')}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors border",
              filtro === 'TODAS'
                ? "bg-[#1B4332] text-white border-[#1B4332]"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            )}
          >
            Todas
          </button>
          <button
            onClick={() => setFiltro('PENDIENTE')}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors border",
              filtro === 'PENDIENTE'
                ? "bg-[#1B4332] text-white border-[#1B4332]"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            )}
          >
            Pendientes
          </button>
          <button
            onClick={() => setFiltro('RESUELTA')}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors border",
              filtro === 'RESUELTA'
                ? "bg-[#1B4332] text-white border-[#1B4332]"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            )}
          >
            Resueltas
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Cargando alertas...</div>
        ) : alertasFiltradas.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400 font-medium">No se encontraron alertas en esta categoría</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {alertasFiltradas.map((alerta) => (
              <li key={alerta.id} className="p-4 hover:bg-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className={cn(
                    "w-2 h-12 rounded-full shrink-0",
                    alerta.tipo === 'LLENO' ? "bg-[#E63946]" : 
                    alerta.tipo === 'OFFLINE' ? "bg-gray-400" : "bg-[#F4A261]"
                  )}></div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate">Contenedor {alerta.contenedorId} - {alerta.tipo}</h3>
                    <p className="text-sm text-gray-500 truncate">{alerta.ubicacion}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end pl-6 sm:pl-0">
                  <span className="text-sm text-gray-400 whitespace-nowrap">
                    {new Date(alerta.fecha).toLocaleString()}
                  </span>
                  
                  {alerta.estado === 'PENDIENTE' ? (
                    <button 
                      onClick={() => resolverAlerta(alerta.id)}
                      className="px-3 py-1 rounded-full text-xs font-semibold shrink-0 bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors"
                    >
                      Marcar Resuelta
                    </button>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold shrink-0 bg-green-100 text-green-700">
                      RESUELTA
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
