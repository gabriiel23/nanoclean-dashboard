import Link from 'next/link';
import { ArrowLeft, Cpu, Wifi, ActivitySquare } from 'lucide-react';
import { cn } from '../../../../lib/utils';

export default async function NodoDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  return (
    <div className="space-y-6 max-w-5xl">
      <Link href="/dashboard/nodos" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Volver a Nodos
      </Link>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Nodo Sensor: {id}</h1>
            <p className="text-gray-500">
              Diagnóstico profundo del hardware ESP32. Monitorea la calidad de la señal WiFi, el historial de paquetes MQTT y el consumo de energía.
            </p>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-700 font-bold rounded-lg border border-green-200">
            ONLINE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-y border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
              <Wifi className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Intensidad WiFi</p>
              <p className="font-semibold text-gray-900">-65 dBm (Excelente)</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
              <ActivitySquare className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Uptime del Sistema</p>
              <p className="font-semibold text-gray-900">99.9% (24 días)</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
              <Cpu className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Broker MQTT</p>
              <p className="font-semibold text-gray-900">Conectado a HiveMQ</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Registro de Logs en Vivo</h2>
          <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-green-400 h-64 overflow-y-auto">
            <p className="mb-1 opacity-50">[12:45:00] Subscribing to topic v1/residuos/sensor/{id}...</p>
            <p className="mb-1 opacity-50">[12:45:02] Connected to HiveMQ Cloud TLS: 8883</p>
            <p className="mb-1 opacity-50">[12:45:05] Payload received: {"{ distance: 45, bin: 'plastic' }"}</p>
            <p className="mb-1 text-white animate-pulse">Waiting for next transmission...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
