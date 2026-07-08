import { Blocks } from 'lucide-react';

export default function ClasificacionesStatsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Estadísticas de Clasificación</h1>
        <p className="text-gray-500 mt-2">
          Observa qué tipo de residuos se depositan más en cada ubicación. Estos datos provienen del modelo de IA YOLOv8 en los contenedores.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <Blocks className="w-6 h-6 text-[#1B4332]" />
          <h2 className="text-lg font-bold text-gray-900">Resumen General por Categoría</h2>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-sm text-gray-500">
              <th className="p-4 font-medium border-b border-gray-100">Contenedor</th>
              <th className="p-4 font-medium border-b border-gray-100">Plástico</th>
              <th className="p-4 font-medium border-b border-gray-100">Vidrio</th>
              <th className="p-4 font-medium border-b border-gray-100">Metal</th>
              <th className="p-4 font-medium border-b border-gray-100">Orgánico</th>
              <th className="p-4 font-medium border-b border-gray-100">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {/* Filas Mockeadas */}
            {[
              { id: 'C-01', p: 450, v: 120, m: 85, o: 300, t: 955 },
              { id: 'C-08', p: 890, v: 45, m: 30, o: 150, t: 1115 },
              { id: 'C-14', p: 320, v: 210, m: 65, o: 410, t: 1005 },
              { id: 'C-22', p: 150, v: 80, m: 40, o: 85, t: 355 },
            ].map(row => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-bold text-gray-900">{row.id}</td>
                <td className="p-4 text-blue-600 font-medium">{row.p}</td>
                <td className="p-4 text-green-600 font-medium">{row.v}</td>
                <td className="p-4 text-gray-600 font-medium">{row.m}</td>
                <td className="p-4 text-amber-700 font-medium">{row.o}</td>
                <td className="p-4 font-bold text-gray-900">{row.t}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
