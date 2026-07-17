'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Leaf, Scan, CheckCircle, ArrowLeft } from 'lucide-react';
import { cn } from '../../lib/utils';

type Categoria = 'PLASTICO' | 'VIDRIO' | 'METAL' | 'ORGANICO';

interface ResultadoClasificacion {
  categoria: Categoria;
  confianza: number;
}

export default function PantallaClasificacion() {
  const [estado, setEstado] = useState<'ESPERA' | 'ESCANEO' | 'RESULTADO'>('ESPERA');
  const [resultado, setResultado] = useState<ResultadoClasificacion | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Inicializar la cámara web
  useEffect(() => {
    let stream: MediaStream | null = null;

    async function setupCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } // Preferir cámara trasera si es dispositivo móvil
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error al acceder a la cámara:", err);
      }
    }

    setupCamera();

    // Limpiar la cámara cuando el componente se desmonte
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Simulación del comportamiento para desarrollo
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const simularCiclo = () => {
      setEstado('ESCANEO');
      
      // Simular tiempo de procesamiento de YOLOv8 (2.5 segundos)
      timeoutId = setTimeout(() => {
        const categorias: Categoria[] = ['PLASTICO', 'VIDRIO', 'METAL', 'ORGANICO'];
        const randomCat = categorias[Math.floor(Math.random() * categorias.length)];
        
        setResultado({
          categoria: randomCat,
          confianza: Math.floor(Math.random() * 15) + 85 // Entre 85% y 99%
        });
        setEstado('RESULTADO');

        // Mantener el resultado por 6 segundos
        timeoutId = setTimeout(() => {
          setEstado('ESPERA');
          setResultado(null);
          
          // Esperar 4 segundos antes de otra simulación
          timeoutId = setTimeout(simularCiclo, 4000);
        }, 6000);

      }, 2500);
    };

    // Iniciar simulación tras 3 segundos de montar la vista
    timeoutId = setTimeout(simularCiclo, 3000);

    return () => clearTimeout(timeoutId);
  }, []);

  const getThemePorCategoria = (cat: Categoria) => {
    switch(cat) {
      case 'PLASTICO': return { bg: 'bg-[#3B82F6]', text: 'text-[#3B82F6]', lightBg: 'bg-blue-50' };
      case 'VIDRIO': return { bg: 'bg-[#10B981]', text: 'text-[#10B981]', lightBg: 'bg-green-50' };
      case 'METAL': return { bg: 'bg-[#6B7280]', text: 'text-[#6B7280]', lightBg: 'bg-gray-50' };
      case 'ORGANICO': return { bg: 'bg-[#92400E]', text: 'text-[#92400E]', lightBg: 'bg-amber-50' };
    }
  };

  const theme = resultado ? getThemePorCategoria(resultado.categoria) : null;

  return (
    <div className="min-h-screen bg-[#F8FAF8] flex flex-col relative overflow-hidden">
      {/* Header Público */}
      <header className="p-6 md:p-8 flex flex-col sm:flex-row justify-center items-center gap-6 relative">
        {/* Botón Volver (Mejorado y responsivo) */}
        <Link
          href="/dashboard"
          className="sm:absolute sm:left-8 flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 bg-white border-2 border-[#1B4332] rounded-xl shadow-lg text-[#1B4332] font-bold hover:bg-[#1B4332] hover:text-white transition-all z-50 group self-start sm:self-auto"
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:-translate-x-1" />
          <span className="text-base sm:text-lg">Volver al Dashboard</span>
        </Link>

        <div className="flex items-center gap-3">
          <Leaf className="w-8 h-8 sm:w-10 sm:h-10 text-[#1B4332]" fill="currentColor" />
          <span className="text-[#1B4332] font-black text-3xl sm:text-4xl tracking-tight">ÑañoClean</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 sm:-mt-16">
        
        {/* Título de Instrucción */}
        <div className="text-center mb-10 h-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 transition-all">
            {estado === 'ESPERA' && "Coloca tu residuo frente a la cámara"}
            {estado === 'ESCANEO' && "Identificando residuo..."}
            {estado === 'RESULTADO' && "¡Clasificación exitosa!"}
          </h1>
        </div>

        {/* Contenedor Interactivo */}
        <div className="relative w-full max-w-4xl aspect-[16/10] bg-gray-900 rounded-[2rem] shadow-2xl border-[12px] border-white overflow-hidden flex items-center justify-center">
          
          {/* Cámara real */}
          <video 
            ref={videoRef}
            autoPlay 
            playsInline 
            muted 
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Overlay oscuro para la cámara */}
          <div className="absolute inset-0 bg-black/20"></div>
          
          {estado === 'ESPERA' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-4 backdrop-blur-[2px]">
              <Scan className="w-32 h-32 opacity-70" />
            </div>
          )}
          
          {/* Animación de escaneo */}
          {estado === 'ESCANEO' && (
            <>
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-500">
                <Scan className="w-48 h-48 text-[#52B788] animate-pulse" />
              </div>
              <div className="absolute top-0 left-0 w-full h-2 bg-[#52B788] shadow-[0_0_20px_10px_#52B788] animate-[scan_2s_ease-in-out_infinite]"></div>
            </>
          )}

          {/* Tarjeta de Resultado Superpuesta */}
          {estado === 'RESULTADO' && resultado && theme && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in zoom-in duration-300">
              <div className={cn("bg-white p-12 rounded-[2.5rem] shadow-2xl max-w-xl w-full text-center border-b-[12px]", theme.bg.replace('bg-', 'border-'))}>
                <div className={cn("w-28 h-28 rounded-full mx-auto flex items-center justify-center mb-6", theme.lightBg)}>
                  <CheckCircle className={cn("w-16 h-16", theme.text)} />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-500 mb-2 uppercase tracking-widest">Contenedor Destino</h2>
                <p className={cn("text-7xl font-black mb-8 tracking-tighter", theme.text)}>
                  {resultado.categoria}
                </p>

                <div className="bg-gray-50 rounded-3xl p-8 text-left">
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-base font-semibold text-gray-500">Confianza de IA</span>
                    <span className="text-2xl font-bold text-gray-800">{resultado.confianza}%</span>
                  </div>
                  <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full transition-all duration-1000 ease-out", theme.bg)} 
                      style={{ width: `${resultado.confianza}%` }}
                    />
                  </div>
                </div>

                <p className="mt-8 text-gray-400 font-medium text-lg animate-pulse">
                  Por favor, deposita el residuo ahora.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <style jsx global>{`
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
      `}</style>
    </div>
  );
}
