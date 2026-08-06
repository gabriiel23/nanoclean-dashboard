'use client';

import { Trash2, AlertTriangle, Blocks } from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';
import Chart from '../../components/dashboard/Chart';
import BinVisualizer from '../../components/dashboard/BinVisualizer';
import { useDashboardData } from '../../hooks/useDashboardData';
import { useClasificacionData } from '../../hooks/useClasificacionData';
import { cn } from '../../lib/utils';

export default function DashboardPage() {
  const { data, loading, error } = useDashboardData();
  const { estadisticas } = useClasificacionData();

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

      {/* ── Sección 3: Gráficas de Historial y Estadísticas de Clasificación ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Chart historial={historial} />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Tarjeta Resumen */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center min-h-[250px]">
            <h3 className="text-[16px] font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-xl">📊</span> Resumen General
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-gray-500 font-medium text-sm">Clasificaciones Hoy</span>
                <span className="text-xl font-black text-[#1B4332]">{estadisticas?.resumen?.totalClasificacionesHoy ?? 0}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-gray-500 font-medium text-sm">Esta Semana</span>
                <span className="text-xl font-black text-[#1B4332]">{estadisticas?.resumen?.totalClasificacionesSemana ?? 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium text-sm">Confianza Promedio de IA</span>
                <span className="text-xl font-black text-[#52B788]">{estadisticas?.resumen?.confianzaPromedio ?? 0}%</span>
              </div>
            </div>
          </div>

          {/* Tarjeta Distribución */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center min-h-[250px]">
            <h3 className="text-[16px] font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-xl">📈</span> Distribución de Residuos
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-bold text-gray-700">Orgánico</span>
                    <span className="text-xs font-bold text-green-600">
                      {estadisticas?.resumen?.distribucionContenedores?.ORGANICO?.porcentaje ?? 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-green-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${estadisticas?.resumen?.distribucionContenedores?.ORGANICO?.porcentaje ?? 0}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <span className="w-3 h-3 bg-gray-500 rounded-full"></span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-bold text-gray-700">Papel / Cartón</span>
                    <span className="text-xs font-bold text-gray-600">
                      {estadisticas?.resumen?.distribucionContenedores?.PAPEL_CARTON?.porcentaje ?? 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-gray-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${estadisticas?.resumen?.distribucionContenedores?.PAPEL_CARTON?.porcentaje ?? 0}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-bold text-gray-700">Plástico</span>
                    <span className="text-xs font-bold text-blue-600">
                      {estadisticas?.resumen?.distribucionContenedores?.PLASTICO?.porcentaje ?? 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${estadisticas?.resumen?.distribucionContenedores?.PLASTICO?.porcentaje ?? 0}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
