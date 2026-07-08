import { Contenedor, Alerta, Nodo, EstadisticasDashboard } from '../types';

export const mockContenedores: Contenedor[] = [
  {
    id: 'C-01',
    nombre: 'Contenedor Central',
    ubicacion: 'Plaza Central de Loja',
    nivelLlenado: 45,
    estado: 'ONLINE',
    requiereRecoleccion: false,
    ultimaActualizacion: new Date().toISOString(),
    lat: -3.9931400,
    lng: -79.2041800,
  },
  {
    id: 'C-14',
    nombre: 'Contenedor Mercado',
    ubicacion: 'Mercado Centro Comercial',
    nivelLlenado: 72,
    estado: 'ONLINE',
    requiereRecoleccion: false,
    ultimaActualizacion: new Date().toISOString(),
    lat: -3.9971200,
    lng: -79.2058300,
  },
  {
    id: 'C-08',
    nombre: 'Contenedor Parque',
    ubicacion: 'Parque Jipiro',
    nivelLlenado: 92,
    estado: 'ONLINE',
    requiereRecoleccion: true,
    ultimaActualizacion: new Date().toISOString(),
    lat: -3.9806600,
    lng: -79.2072400,
  },
  {
    id: 'C-22',
    nombre: 'Contenedor Universidad',
    ubicacion: 'Universidad Nacional de Loja',
    nivelLlenado: 15,
    estado: 'ONLINE',
    requiereRecoleccion: false,
    ultimaActualizacion: new Date().toISOString(),
    lat: -3.9997800,
    lng: -79.1991200,
  },
  {
    id: 'C-05',
    nombre: 'Contenedor Terminal',
    ubicacion: 'Terminal Terrestre de Loja',
    nivelLlenado: 60,
    estado: 'OFFLINE',
    requiereRecoleccion: false,
    ultimaActualizacion: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    lat: -4.0073500,
    lng: -79.2098600,
  },
  {
    id: 'C-33',
    nombre: 'Contenedor Estadio',
    ubicacion: 'Estadio Ciudad de Loja',
    nivelLlenado: 88,
    estado: 'ONLINE',
    requiereRecoleccion: true,
    ultimaActualizacion: new Date().toISOString(),
    lat: -3.9875500,
    lng: -79.2134700,
  },
];

export const mockEstadisticas: EstadisticasDashboard = {
  totalContenedores: 124,
  alertasHoy: 8,
  clasificacionesHoy: 1420,
};

export const mockAlertas: Alerta[] = [
  {
    id: 'A-001',
    contenedorId: 'C-08',
    ubicacion: 'Parque Norte',
    tipo: 'LLENO',
    estado: 'PENDIENTE',
    fecha: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // hace 30 min
  },
  {
    id: 'A-002',
    contenedorId: 'C-05',
    ubicacion: 'Estación de Buses',
    tipo: 'OFFLINE',
    estado: 'PENDIENTE',
    fecha: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // hace 2 horas
  },
  {
    id: 'A-003',
    contenedorId: 'C-12',
    ubicacion: 'Calle 5',
    tipo: 'ADVERTENCIA',
    estado: 'RESUELTA',
    fecha: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // hace 1 día
  }
];

export const mockNodos: Nodo[] = [
  {
    id: 'NODE-01',
    ubicacion: 'Plaza Central',
    estado: 'ONLINE',
    senalWifiDbm: -65,
    ultimoDato: new Date().toISOString(),
    uptimePorcentaje: 99.9,
    conexionMqtt: 'CONECTADO',
  },
  {
    id: 'NODE-08',
    ubicacion: 'Parque Norte',
    estado: 'ONLINE',
    senalWifiDbm: -72,
    ultimoDato: new Date().toISOString(),
    uptimePorcentaje: 98.5,
    conexionMqtt: 'CONECTADO',
  },
  {
    id: 'NODE-05',
    ubicacion: 'Estación de Buses',
    estado: 'OFFLINE',
    senalWifiDbm: -90,
    ultimoDato: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    uptimePorcentaje: 85.0,
    conexionMqtt: 'DESCONECTADO',
  }
];
