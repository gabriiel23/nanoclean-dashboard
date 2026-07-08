'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { DatoHistorialBackend } from '../../types';

interface ChartProps {
  historial: Record<string, DatoHistorialBackend[]>;
}

export default function Chart({ historial }: ChartProps) {
  // Transformar el historial a un formato que Recharts entienda
  const timeMap = new Map<string, any>();
  const sensores = Object.keys(historial);

  Object.entries(historial).forEach(([sensorId, datos]) => {
    datos.forEach((dato) => {
      const date = new Date(dato.timestamp);
      const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      
      const existing = timeMap.get(timeStr) || { time: timeStr };
      existing[sensorId] = dato.porcentaje;
      timeMap.set(timeStr, existing);
    });
  });

  // Ordenar los tiempos cronológicamente
  const allTimestamps = Array.from(timeMap.keys()).sort((a, b) => a.localeCompare(b));

  // Arrastrar el último valor conocido (Forward-fill) para evitar líneas rotas
  const lastKnownValues: Record<string, number> = {};
  
  const data = allTimestamps.map(time => {
    const dataPoint = timeMap.get(time);
    const newPoint: any = { time };
    
    sensores.forEach(sensorId => {
      if (dataPoint[sensorId] !== undefined) {
        lastKnownValues[sensorId] = dataPoint[sensorId];
        newPoint[sensorId] = dataPoint[sensorId];
      } else if (lastKnownValues[sensorId] !== undefined) {
        newPoint[sensorId] = lastKnownValues[sensorId]; // Mantiene el último nivel conocido
      }
    });
    
    return newPoint;
  });
  const colores = ['#52B788', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="bg-white px-6 py-5 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-[14px] font-semibold text-gray-800">Historial de Llenado Global</h2>
        <span className="text-[11px] text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">En tiempo real</span>
      </div>
      
      <div className="h-[250px] w-full mt-2">
        {data.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            Esperando datos de los contenedores...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                {sensores.map((sensorId, index) => (
                  <linearGradient key={sensorId} id={`color${sensorId}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colores[index % colores.length]} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={colores[index % colores.length]} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <XAxis 
                dataKey="time" 
                axisLine={true} 
                tickLine={false} 
                tick={{ fill: '#9CA3AF', fontSize: 11 }} 
                dy={10}
                minTickGap={30}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9CA3AF', fontSize: 11 }}
                tickFormatter={(value) => `${value}%`}
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
              />
              <CartesianGrid vertical={false} stroke="#F3F4F6" strokeDasharray="4 4" opacity={0.6} />
              
              <Tooltip 
                formatter={(value: any, name: any) => [typeof value === 'number' ? `${value.toFixed(1)}%` : `${value}%`, name]}
                labelStyle={{ fontWeight: 'bold', color: '#374151', marginBottom: '4px' }}
                contentStyle={{ borderRadius: '12px', border: '1px solid #F3F4F6', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)', padding: '10px 14px' }}
              />
              
              <Legend 
                verticalAlign="top" 
                align="right" 
                iconType="circle" 
                wrapperStyle={{ fontSize: '12px', paddingBottom: '10px' }}
              />

              {sensores.map((sensorId, index) => (
                <Area
                  key={sensorId}
                  type="monotone"
                  dataKey={sensorId}
                  name={`Contenedor ${sensorId}`}
                  stroke={colores[index % colores.length]}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill={`url(#color${sensorId})`}
                  connectNulls={true}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
