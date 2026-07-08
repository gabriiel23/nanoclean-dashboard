export interface Contenedor {
  id: string;
  nombre: string;
  ubicacion: string;
  nivelLlenado: number; // 0 - 100
  estado: 'ONLINE' | 'OFFLINE';
  requiereRecoleccion: boolean;
  ultimaActualizacion: string;
  lat: number;
  lng: number;
}

export interface Alerta {
  id: string;
  contenedorId: string;
  ubicacion: string;
  tipo: 'LLENO' | 'OFFLINE' | 'ADVERTENCIA';
  estado: 'PENDIENTE' | 'RESUELTA';
  fecha: string;
}

export interface Nodo {
  id: string;
  ubicacion: string;
  estado: 'ONLINE' | 'OFFLINE';
  senalWifiDbm: number;
  ultimoDato: string;
  uptimePorcentaje: number;
  conexionMqtt: 'CONECTADO' | 'DESCONECTADO';
}

export interface Clasificacion {
  id: string;
  categoria: 'PLASTICO' | 'VIDRIO' | 'METAL' | 'ORGANICO';
  confianza: number; // 0 - 100
  fecha: string;
}

export interface EstadisticasDashboard {
  totalContenedores: number;
  alertasHoy: number;
  clasificacionesHoy: number;
}

// --- Nuevos tipos del Backend Real ---

export interface ResumenBackend {
  totalContenedores: number;
  contenedoresCriticos: number;
  promedioLlenado: number;
}

export interface ContenedorBackend {
  id: string;
  distanciaActual: number;
  porcentajeLlenado: number;
  estadoCritico: boolean;
  estadoSensor: 'ONLINE' | 'OFFLINE';
  ultimaRecoleccion: string;
  ultimoDato: string;
}

export interface DatoHistorialBackend {
  timestamp: string;
  porcentaje: number;
}

export interface DashboardResponseBackend {
  resumen: ResumenBackend;
  contenedores: ContenedorBackend[];
  historial: Record<string, DatoHistorialBackend[]>;
}
