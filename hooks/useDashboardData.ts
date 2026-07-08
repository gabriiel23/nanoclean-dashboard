'use client';

import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { DashboardResponseBackend, ContenedorBackend } from '../types';

export function useDashboardData() {
  const [data, setData] = useState<DashboardResponseBackend | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Carga Inicial REST
    async function fetchInitialData() {
      try {
        const res = await fetch('http://10.115.178.214:3000/api/dashboard');
        if (!res.ok) throw new Error('Error al cargar datos del backend');
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || 'Error de conexión');
      } finally {
        setLoading(false);
      }
    }

    fetchInitialData();

    // 2. Conexión WebSocket
    const socket: Socket = io('http://10.115.178.214:3000');

    socket.on('sensorData', (newData: any) => {
      // newData esperado: { sensor: 'sensor1', distancia: 6.76, porcentajeLlenado: 77.5, timestamp: '...' }
      setData((prev) => {
        if (!prev) return prev;

        const timestamp = newData.timestamp || new Date().toISOString();
        const porcentaje = newData.porcentajeLlenado ?? 0;
        
        // Actualizar el contenedor específico
        const contenedores = prev.contenedores.map(c => {
          if (c.id === newData.sensor) {
            return {
              ...c,
              distanciaActual: newData.distancia ?? c.distanciaActual,
              porcentajeLlenado: porcentaje,
              estadoCritico: porcentaje >= 80,
              ultimoDato: timestamp
            };
          }
          return c;
        });

        // Recalcular resumen
        const totalContenedores = contenedores.length;
        const contenedoresCriticos = contenedores.filter(c => c.estadoCritico).length;
        const sumaPorcentaje = contenedores.reduce((acc, c) => acc + c.porcentajeLlenado, 0);
        const promedioLlenado = totalContenedores > 0 ? parseFloat((sumaPorcentaje / totalContenedores).toFixed(1)) : 0;

        // Actualizar historial
        const historial = { ...prev.historial };
        if (!historial[newData.sensor]) historial[newData.sensor] = [];
        historial[newData.sensor] = [
          ...historial[newData.sensor],
          { timestamp, porcentaje }
        ];

        return {
          resumen: { totalContenedores, contenedoresCriticos, promedioLlenado },
          contenedores,
          historial
        };
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return { data, loading, error };
}
