'use client';

import { Trash2, AlertTriangle, Blocks } from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';
import Chart from '../../components/dashboard/Chart';
import BinVisualizer from '../../components/dashboard/BinVisualizer';
import { useDashboardData } from '../../hooks/useDashboardData';
import { cn } from '../../lib/utils';

export default function DashboardPage() {
  const { data, loading, error } = useDashboardData();

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-[#52B788] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Conectando al backend de NanoClean...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-200 text-center max-w-md">
          <AlertTriangle className="w-10 h-10 mx-auto mb-3 text-red-500" />
          <h2 className="font-bold text-lg mb-2">Error de conexión</h2>
          <p className="text-sm">No se pudo contactar con el backend (http://localhost:3000).</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  const { resumen, contenedores, historial } = data;

  return (
    <div className="space-y-6">

      {/* ── Sección 1: Summary Widgets ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Contenedores"
          value={resumen.totalContenedores}
          icon={<Trash2 className="w-5 h-5 text-[#1B4332]" />}
          iconBgColor="bg-[#52B788]/15"
        />
        <StatCard
          title="Nivel Promedio"
          value={`${resumen.promedioLlenado}%`}
          icon={<Blocks className="w-5 h-5 text-[#1B4332]" />}
          iconBgColor="bg-[#52B788]/15"
        />
        <div className={cn(
          "transition-all duration-300",
          resumen.contenedoresCriticos > 0 ? "shadow-[0_0_20px_rgba(230,57,70,0.4)] animate-pulse rounded-2xl" : ""
        )}>
          <StatCard
            title="Alertas Críticas"
            value={resumen.contenedoresCriticos}
            icon={<AlertTriangle className={cn("w-5 h-5", resumen.contenedoresCriticos > 0 ? "text-white" : "text-[#E63946]")} />}
            iconBgColor={resumen.contenedoresCriticos > 0 ? "bg-[#E63946]" : "bg-[#E63946]/10"}
            valueColor={resumen.contenedoresCriticos > 0 ? "text-[#E63946]" : "text-gray-900"}
          />
        </div>
      </div>

      {/* ── Sección 2: Visualizadores Físicos ── */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-gray-800">Visualizadores Físicos</h2>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500"><span className="w-2.5 h-2.5 rounded-full bg-green-400" /> Normal</span>
            <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400" /> Alerta</span>
            <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Crítico</span>
          </div>
        </div>

        {contenedores.length === 0 ? (
          <div className="py-10 text-center text-gray-500">No hay contenedores registrados.</div>
        ) : (
          <div className="flex flex-wrap gap-10 justify-center">
            {contenedores.map(contenedor => (
              <BinVisualizer key={contenedor.id} contenedor={contenedor} />
            ))}
          </div>
        )}
      </div>

      {/* ── Sección 3: Gráficas de Historial ── */}
      <Chart historial={historial} />

    </div>
  );
}
