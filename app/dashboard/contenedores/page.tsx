import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { mockContenedores } from '../../../data/mockData';
import ContainerCard from '../../../components/dashboard/ContainerCard';

export default function ContenedoresPage() {
  return (
    <div className="space-y-6">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Volver al Dashboard
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Flota de Contenedores</h1>
        <p className="text-gray-500 mt-2">
          Listado completo de todos los contenedores inteligentes desplegados en la ciudad. Selecciona cualquiera para ver su historial detallado y análisis de capacidad.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockContenedores.map((contenedor) => (
          <ContainerCard key={contenedor.id} contenedor={contenedor} />
        ))}
      </div>
    </div>
  );
}
