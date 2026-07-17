export default function AjustesPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800">Ajustes del Sistema</h1>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Configuración de Alertas</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-700">Umbral de Llenado Crítico</p>
                <p className="text-sm text-gray-500">Porcentaje al cual el contenedor se marca como LLENO.</p>
              </div>
              <input type="number" defaultValue={85} className="w-20 p-2 border border-gray-200 rounded text-center" />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-700">Tiempo para alerta de OFFLINE</p>
                <p className="text-sm text-gray-500">Minutos sin conexión antes de marcar nodo desconectado.</p>
              </div>
              <input type="number" defaultValue={10} className="w-20 p-2 border border-gray-200 rounded text-center" />
            </div>
          </div>
        </div>
        
        <div className="pt-6 border-t border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Conexión MQTT</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Broker URL</label>
              <input type="text" defaultValue="tls://xxx.hivemq.cloud:8883" className="w-full p-2 border border-gray-200 rounded" disabled />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button className="bg-[#1B4332] text-white px-6 py-2 rounded-lg font-medium">Guardar Cambios</button>
        </div>
      </div>
    </div>
  );
}
