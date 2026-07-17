import Link from 'next/link';
import { ArrowLeft, MapPin, Battery, Activity } from 'lucide-react';

export default async function ContenedorDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  return (
    <div className="space-y-6 max-w-5xl">
      <Link href="/dashboard/contenedores" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Volver a la lista
      </Link>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Contenedor {id}</h1>
            <p className="text-gray-500">
              Vista detallada del contenedor. Aquí podrás ver su historial de llenado, estado de los sensores y proyecciones de recolección.
            </p>
          </div>
          <span className="px-3 py-1 bg-[#52B788]/20 text-[#1B4332] font-bold rounded-lg">
            ONLINE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-y border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-gray-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Ubicación</p>
              <p className="font-semibold text-gray-900">Ubicación Mockeada</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
              <Activity className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Nivel de Llenado</p>
              <p className="font-semibold text-gray-900">72%</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
              <Battery className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Batería ESP32</p>
              <p className="font-semibold text-gray-900">89%</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Gráfica Histórica (Mock)</h2>
          <div className="h-64 w-full bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center text-gray-400">
            [Área reservada para gráfica individual del contenedor]
          </div>
        </div>
      </div>
    </div>
  );
}
