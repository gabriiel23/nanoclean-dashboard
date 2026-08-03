'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export type Categoria = 'ORGANICO' | 'PAPEL_CARTON' | 'PLASTICO';

export interface ResultadoClasificacion {
  id: number;
  contenedor: Categoria;
  clase: string;
  confianza: number;
  color: string;
  instruccion: string;
  timestamp: string;
  bbox?: [number, number, number, number];
}

export interface EstadisticasClasificacion {
  resumen: {
    totalClasificacionesHoy: number;
    totalClasificacionesSemana: number;
    confianzaPromedio: number;
    distribucionContenedores: {
      ORGANICO?: { count: number; porcentaje: number };
      PAPEL_CARTON?: { count: number; porcentaje: number };
      PLASTICO?: { count: number; porcentaje: number };
    };
    objetosMasComunes: { clase: string; count: number }[];
  };
  clasificacionesPorHora: { hora: number; count: number }[];
  ultimasClasificaciones: ResultadoClasificacion[];
}

interface UseClasificacionDataReturn {
  ultimaDeteccion: ResultadoClasificacion | null;
  historial: ResultadoClasificacion[];
  estadisticas: EstadisticasClasificacion | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  conectar: () => void;
  desconectar: () => void;
}

export function useClasificacionData(): UseClasificacionDataReturn {
  const socketRef = useRef<Socket | null>(null);
  const [ultimaDeteccion, setUltimaDeteccion] = useState<ResultadoClasificacion | null>(null);
  const [historial, setHistorial] = useState<ResultadoClasificacion[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasClasificacion | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEstadisticas = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:3001/api/dashboard/clasificacion/resumen');
      if (!res.ok) throw new Error('Error al cargar estadísticas');
      const data = await res.json();
      setEstadisticas(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  const conectar = useCallback(() => {
    if (socketRef.current?.connected) return;

    const newSocket = io('http://localhost:3001', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
    });

    socketRef.current = newSocket;

    newSocket.on('connect', () => {
      console.log('Socket.IO conectado');
      setIsConnected(true);
      setError(null);
      setIsLoading(false);
      fetchEstadisticas();
    });

    newSocket.on('clasificacionDetectada', (data: ResultadoClasificacion) => {
      console.log('Clasificación detectada:', data);
      setUltimaDeteccion(data);
      setHistorial((prev) => [data, ...prev].slice(0, 50)); // Mantener los últimos 50
      fetchEstadisticas();
    });

    newSocket.on('disconnect', () => {
      console.log('Socket.IO desconectado');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket.IO error:', err);
      setError('Error de conexión');
      setIsConnected(false);
      setIsLoading(false);
    });
  }, [fetchEstadisticas]);

  const desconectar = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    conectar();

    return () => {
      desconectar();
    };
  }, [conectar, desconectar]);

  return {
    ultimaDeteccion,
    historial,
    estadisticas,
    isConnected,
    isLoading,
    error,
    conectar,
    desconectar,
  };
}
