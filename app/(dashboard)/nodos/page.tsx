import Link from 'next/link';
import { mockNodos } from '../../../data/mockData';
import { cn } from '../../../lib/utils';

export default function NodosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Estado de Nodos (Sensores)</h1>
        <p className="text-gray-500 mt-2">
          Monitorización del estado de salud del hardware ESP32 instalado en cada contenedor. Haz clic en un nodo para ver su diagnóstico profundo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockNodos.map((nodo) => (
          <Link key={nodo.id} href={`/nodos/${nodo.id}`} className="block transition-all hover:-translate-y-1 hover:shadow-md rounded-xl">
            <div className={cn(
              "p-6 rounded-xl shadow-sm border h-full",
              nodo.estado === 'OFFLINE' ? "bg-[#FFF1F1] border-red-200" : "bg-white border-gray-100"
            )}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-gray-800">{nodo.id}</h3>
                  <p className="text-sm text-gray-500">{nodo.ubicacion}</p>
                </div>
                <span className={cn(
                  "px-2 py-1 text-xs font-bold rounded",
                  nodo.estado === 'ONLINE' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                )}>
                  {nodo.estado}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Señal WiFi:</span>
                  <span className="font-medium text-gray-800">{nodo.senalWifiDbm} dBm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Uptime:</span>
                  <span className="font-medium text-gray-800">{nodo.uptimePorcentaje}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">MQTT:</span>
                  <span className={cn(
                    "font-medium",
                    nodo.conexionMqtt === 'CONECTADO' ? "text-green-600" : "text-red-600"
                  )}>{nodo.conexionMqtt}</span>
                </div>
                <div className="pt-2 border-t border-gray-100 mt-2">
                  <span className="text-xs text-gray-400">Último dato: {new Date(nodo.ultimoDato).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
