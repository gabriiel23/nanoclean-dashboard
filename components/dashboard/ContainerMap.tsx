'use client';

import { useState, useCallback } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import Link from 'next/link';
import { Crosshair } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { Contenedor } from '../../types';

type TileStyle = 'streets' | 'light' | 'dark';

interface TileOption {
  label: string;
  url: string;
  attribution: string;
}

const TILE_OPTIONS: Record<TileStyle, TileOption> = {
  streets: {
    label: 'Calles',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  light: {
    label: 'Claro',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
  },
  dark: {
    label: 'Oscuro',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
  },
};

const LOJA_CENTER: [number, number] = [-3.9931, -79.2042];
const LOJA_ZOOM = 13;

function getMarkerColor(contenedor: Contenedor): string {
  if (contenedor.estado === 'OFFLINE') return '#6B7280';
  if (contenedor.nivelLlenado >= 90) return '#E63946';
  if (contenedor.nivelLlenado >= 70) return '#F4A261';
  return '#52B788';
}

function getStatusLabel(contenedor: Contenedor): string {
  if (contenedor.estado === 'OFFLINE') return 'ESP32 Offline';
  if (contenedor.nivelLlenado >= 90) return 'Urgente – Recolectar ya';
  if (contenedor.nivelLlenado >= 70) return 'Alerta – Casi lleno';
  return 'OK';
}

// Componente interno para acceder al contexto del mapa y centrar en Loja
function CenterControl() {
  const map = useMap();
  const handleCenter = useCallback(() => {
    map.flyTo(LOJA_CENTER, LOJA_ZOOM, { animate: true, duration: 1 });
  }, [map]);

  return (
    <button
      onClick={handleCenter}
      title="Centrar en Loja"
      className="absolute top-3 right-3 z-[1000] bg-white hover:bg-gray-50 border border-gray-200 rounded-lg w-9 h-9 flex items-center justify-center shadow-sm transition-colors"
    >
      <Crosshair className="w-4 h-4 text-[#1B4332]" />
    </button>
  );
}

interface Props {
  contenedores: Contenedor[];
}

export default function ContainerMap({ contenedores }: Props) {
  const [tileStyle, setTileStyle] = useState<TileStyle>('light');
  const tile = TILE_OPTIONS[tileStyle];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm" style={{ isolation: 'isolate' }}>
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-gray-50">
        <div className="flex items-center gap-3">
          <h2 className="text-[15px] font-semibold text-gray-800">Mapa de Contenedores</h2>
          <span className="text-xs text-gray-400">Loja, Ecuador</span>
        </div>

        {/* Tile switcher + footer link */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-0.5 bg-gray-100 rounded-lg p-0.5">
            {(Object.keys(TILE_OPTIONS) as TileStyle[]).map((key) => (
              <button
                key={key}
                onClick={() => setTileStyle(key)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all ${
                  tileStyle === key
                    ? 'bg-white text-[#1B4332] shadow-sm'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {TILE_OPTIONS[key].label}
              </button>
            ))}
          </div>
          <Link href="/dashboard/contenedores" className="text-[11px] font-semibold text-[#52B788] hover:underline whitespace-nowrap">
            Ver lista →
          </Link>
        </div>
      </div>

      {/* Map */}
      <div className="h-[360px] w-full relative">
        <MapContainer
          center={LOJA_CENTER}
          zoom={LOJA_ZOOM}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
          zoomControl={false}
        >
          <TileLayer url={tile.url} attribution={tile.attribution} />
          <CenterControl />

          {contenedores.map((c) => {
            const color = getMarkerColor(c);
            return (
              <CircleMarker
                key={c.id}
                center={[c.lat, c.lng]}
                radius={12}
                pathOptions={{
                  color: '#fff',
                  weight: 2.5,
                  fillColor: color,
                  fillOpacity: 0.95,
                }}
              >
                <Tooltip direction="top" offset={[0, -12]} opacity={1}>
                  <div className="text-xs leading-relaxed min-w-[130px]">
                    <p className="font-bold text-gray-800">{c.nombre}</p>
                    <p className="text-gray-500 text-[11px]">{c.ubicacion}</p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className="inline-block w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                      <span className="font-semibold" style={{ color }}>{getStatusLabel(c)}</span>
                    </div>
                    <div className="mt-1 text-[11px] text-gray-500 space-y-0.5">
                      <p>Llenado: <strong className="text-gray-700">{c.nivelLlenado}%</strong></p>
                      <p>ESP32: <strong className="text-gray-700">{c.estado}</strong></p>
                    </div>
                  </div>
                </Tooltip>
              </CircleMarker>
            );
          })}
        </MapContainer>

        {/* Leyenda */}
        <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 px-3 py-2.5 flex flex-col gap-1">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Estado</p>
          {[
            { color: '#52B788', label: 'OK  (< 70%)' },
            { color: '#F4A261', label: 'Alerta  (70–89%)' },
            { color: '#E63946', label: 'Urgente  (≥ 90%)' },
            { color: '#6B7280', label: 'Offline' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full border border-white shadow-sm flex-shrink-0" style={{ backgroundColor: color }} />
              <span className="text-[11px] text-gray-600 font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
