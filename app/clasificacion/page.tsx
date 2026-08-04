'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Leaf, Scan, CheckCircle, ArrowLeft, ArrowRight, ArrowDown, Wifi, WifiOff, Camera, CameraOff, Play, Square } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useClasificacionData, Categoria, ResultadoClasificacion } from '../../hooks/useClasificacionData';
import * as yoloApi from '../../services/yoloApi';

const CATEGORIAS_VALIDAS: Categoria[] = ['PLASTICO', 'PAPEL_CARTON', 'ORGANICO'];

const CATEGORIA_COLORES: Record<Categoria, { bg: string; text: string; lightBg: string; border: string }> = {
  ORGANICO: { bg: 'bg-[#22C55E]', text: 'text-[#22C55E]', lightBg: 'bg-green-50', border: 'border-[#22C55E]' },
  PAPEL_CARTON: { bg: 'bg-[#6B7280]', text: 'text-[#6B7280]', lightBg: 'bg-gray-50', border: 'border-[#6B7280]' },
  PLASTICO: { bg: 'bg-[#3B82F6]', text: 'text-[#3B82F6]', lightBg: 'bg-blue-50', border: 'border-[#3B82F6]' },
};

export default function PantallaClasificacion() {
  const { ultimaDeteccion, historial, estadisticas, isConnected, isLoading } = useClasificacionData();
  
  const [estado, setEstado] = useState<'ESPERA' | 'ESCANEO' | 'RESULTADO'>('ESPERA');
  const [resultado, setResultado] = useState<ResultadoClasificacion | null>(null);
  
  const [yoloServiceAvailable, setYoloServiceAvailable] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [classificationActive, setClassificationActive] = useState(false);
  
  const resultTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isProcessingRef = useRef(false);
  
  // Referencia mutable del estado para que el setInterval siempre sepa en qué estado estamos (closure)
  const estadoRef = useRef<'ESPERA' | 'ESCANEO' | 'RESULTADO'>('ESPERA');
  useEffect(() => {
    estadoRef.current = estado;
  }, [estado]);

  // Ref's para captura local
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bboxCanvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Verificar si YOLO está vivo
  const checkYoloService = useCallback(async () => {
    try {
      // Solo verificamos que el API esté levantado
      const status = await yoloApi.getCameraStatus();
      setYoloServiceAvailable(true);
    } catch {
      setYoloServiceAvailable(false);
    }
  }, []);

  const startClassificationLoop = () => {
    intervalRef.current = setInterval(async () => {
      // SI YA ESTAMOS MOSTRANDO UN RESULTADO, NO SEGUIMOS ENVIANDO FOTOS
      if (estadoRef.current !== 'ESPERA') return;
      if (isProcessingRef.current) return;

      if (!videoRef.current || !canvasRef.current) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context || video.videoWidth === 0) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Control de calidad: Calcular varianza simple para ignorar imágenes negras/borrosas (cámara tapada)
      // Tomamos solo un cuadro del centro para la varianza y así no procesar toda la imagen
      const size = Math.min(video.videoWidth, video.videoHeight) * 0.5;
      const startX = (video.videoWidth - size) / 2;
      const startY = (video.videoHeight - size) / 2;
      const imageData = context.getImageData(startX, startY, size, size);
      const data = imageData.data;
      let sum = 0;
      for (let i = 0; i < data.length; i += 4) {
        sum += (data[i] + data[i+1] + data[i+2]) / 3;
      }
      const mean = sum / (data.length / 4);
      let varianceSum = 0;
      for (let i = 0; i < data.length; i += 4) {
        const val = (data[i] + data[i+1] + data[i+2]) / 3;
        varianceSum += Math.pow(val - mean, 2);
      }
      const variance = varianceSum / (data.length / 4);
      
      // Si la imagen está tapada (oscura) o es de un color liso (poca varianza), no la enviamos
      if (mean < 15 || variance < 100) {
        isProcessingRef.current = false;
        return;
      }

      const base64Image = canvas.toDataURL('image/jpeg', 0.7);
      
      try {
        isProcessingRef.current = true;
        await yoloApi.classifyImage(base64Image);
      } catch (err) {
        console.error("Error enviando frame a YOLO:", err);
      } finally {
        isProcessingRef.current = false;
      }
    }, 500);
  };

  const stopClassificationLoop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Encender cámara web local y empezar a clasificar
  const startSystem = async () => {
    try {
      // Forzar la resolución nativa de 1920x1080
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Esperamos a que el navegador cargue los datos de la cámara antes de darle play
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(e => console.warn("AutoPlay bloqueado:", e));
        };
        
        setCameraActive(true);
        setClassificationActive(true);
        startClassificationLoop();
      }
    } catch (err: any) {
      console.error("Error iniciando cámara local:", err);
      alert(`No se pudo acceder a la cámara.\nError: ${err.name} - ${err.message}\n\nAsegúrate de que ningún otro programa (como Python, Zoom, u otra pestaña) esté usando la cámara.`);
    }
  };

  // Detener cámara local
  const stopSystem = async () => {
    stopClassificationLoop();
    setCameraActive(false);
    setClassificationActive(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  // Inicializar al cargar y limpiar al desmontar
  useEffect(() => {
    checkYoloService();
    return () => {
      stopSystem();
    };
  }, [checkYoloService]);

  // Manejar el WebSocket (cuando el Python -> Node nos avisa)
  useEffect(() => {
    if (!ultimaDeteccion) return;
    if (!CATEGORIAS_VALIDAS.includes(ultimaDeteccion.contenedor as Categoria)) return;

    if (resultTimeoutRef.current) {
      clearTimeout(resultTimeoutRef.current);
    }

    setEstado('ESCANEO');

    // DIBUJAR BOUNDING BOX si existe
    if (ultimaDeteccion.bbox && bboxCanvasRef.current && videoRef.current) {
      const canvas = bboxCanvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const [x1, y1, x2, y2] = ultimaDeteccion.bbox;
        const color = CATEGORIA_COLORES[ultimaDeteccion.contenedor as Categoria].text.replace('text-[', '').replace(']', '');
        ctx.strokeStyle = color.startsWith('#') ? color : '#3B82F6';
        ctx.lineWidth = 6;
        ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
        
        // Etiqueta de la clase
        ctx.fillStyle = ctx.strokeStyle;
        ctx.fillRect(x1, y1 - 30, x2 - x1, 30);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 20px Arial';
        ctx.fillText(`${ultimaDeteccion.contenedor} ${(ultimaDeteccion.confianza * 100).toFixed(1)}%`, x1 + 5, y1 - 8);
      }
    }

    const resultTimer = setTimeout(() => {
      setResultado(ultimaDeteccion);
      setEstado('RESULTADO');

      resultTimeoutRef.current = setTimeout(() => {
        setEstado('ESPERA');
        setResultado(null);
        // Borrar Bounding Box
        if (bboxCanvasRef.current) {
          const ctx = bboxCanvasRef.current.getContext('2d');
          if (ctx) ctx.clearRect(0, 0, bboxCanvasRef.current.width, bboxCanvasRef.current.height);
        }
      }, 3000); // 3 segundos mostrando el resultado
    }, 500); // 0.5 segundos de "escaneo" visual

    return () => {
      clearTimeout(resultTimer);
    };
  }, [ultimaDeteccion]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAF8] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1B4332] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#1B4332] font-semibold">Conectando al sistema...</p>
        </div>
      </div>
    );
  }

  const theme = resultado ? CATEGORIA_COLORES[resultado.contenedor as Categoria] : null;

  return (
    <div className="min-h-screen bg-[#F8FAF8] flex flex-col relative overflow-hidden">
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

        <div className="flex items-center gap-3">
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium",
            isConnected 
              ? "bg-green-100 text-green-700" 
              : "bg-red-100 text-red-700"
          )}>
            {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            <span>Socket.IO</span>
          </div>

          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium",
            yoloServiceAvailable 
              ? "bg-green-100 text-green-700" 
              : "bg-amber-100 text-amber-700"
          )}>
            {yoloServiceAvailable ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
            <span>YOLO {yoloServiceAvailable ? 'Online' : 'Offline'}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 sm:-mt-16">
        <div className="text-center mb-10 h-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 transition-all">
            {estado === 'ESPERA' && "Coloca tu residuo frente a la cámara"}
            {estado === 'ESCANEO' && "Identificando residuo..."}
            {estado === 'RESULTADO' && "¡Clasificación exitosa!"}
          </h1>
        </div>

        <div className="relative w-full max-w-4xl aspect-[16/10] bg-gray-900 rounded-[2rem] shadow-2xl border-[12px] border-white overflow-hidden flex items-center justify-center">
          
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          
          <video 
            ref={videoRef}
            autoPlay 
            playsInline 
            muted
            className={cn("absolute inset-0 w-full h-full object-cover transition-opacity", !cameraActive ? "opacity-0 pointer-events-none" : "opacity-100")}
          />
          
          {/* Overlay para Bounding Box */}
          <canvas
            ref={bboxCanvasRef}
            className={cn("absolute inset-0 w-full h-full object-cover pointer-events-none z-10 transition-opacity", !cameraActive ? "opacity-0" : "opacity-100")}
          />

          {!cameraActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-4 bg-gray-900 z-20">
              <CameraOff className="w-24 h-24 text-gray-500" />
              <p className="text-lg text-gray-400">Cámara Inactiva</p>
              <p className="text-sm text-gray-500">Haz clic en Iniciar YOLO para prender tu cámara web local</p>
            </div>
          )}
          
          {/* Guía visual del escáner (ROI) */}
          {cameraActive && estado === 'ESPERA' && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
              <div className="w-[300px] h-[300px] border-4 border-dashed border-white/50 rounded-2xl relative shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]">
                {/* Esquinas resaltadas */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-400 rounded-tl-xl -m-[4px]"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-400 rounded-tr-xl -m-[4px]"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-400 rounded-bl-xl -m-[4px]"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-400 rounded-br-xl -m-[4px]"></div>
                <div className="absolute -bottom-10 w-full text-center text-white font-medium text-sm drop-shadow-md">Ubica el residuo al centro</div>
              </div>
            </div>
          )}
          
          {estado === 'ESPERA' && cameraActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-4 pointer-events-none">
              <Scan className="w-32 h-32 opacity-50" />
              <p className="text-lg opacity-80 font-medium drop-shadow-md">Esperando detección...</p>
            </div>
          )}
          
          {estado === 'ESCANEO' && (
            <>
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-500">
                <Scan className="w-48 h-48 text-[#52B788] animate-pulse" />
              </div>
              <div className="absolute top-0 left-0 w-full h-2 bg-[#52B788] shadow-[0_0_20px_10px_#52B788] animate-[scan_2s_ease-in-out_infinite]"></div>
            </>
          )}

          {estado === 'RESULTADO' && resultado && theme && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in zoom-in duration-300">
              <div className={cn("bg-white p-12 rounded-[2.5rem] shadow-2xl max-w-xl w-full text-center border-b-[12px]", theme.border)}>
                <div className={cn("w-28 h-28 rounded-full mx-auto flex items-center justify-center mb-6", theme.lightBg)}>
                  <CheckCircle className={cn("w-16 h-16", theme.text)} />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-500 mb-2 uppercase tracking-widest">Contenedor Destino</h2>
                <p className={cn("text-7xl font-black mb-8 tracking-tighter", theme.text)}>
                  {resultado.contenedor}
                </p>

                <div className="bg-gray-50 rounded-3xl p-8 text-left">
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-base font-semibold text-gray-500">Confianza de IA</span>
                    <span className="text-2xl font-bold text-gray-800">{(resultado.confianza * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full transition-all duration-1000 ease-out", theme.bg)} 
                      style={{ width: `${resultado.confianza * 100}%` }}
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

        {/* ── Indicador de Destino del Contenedor ── */}
        {estado === 'RESULTADO' && resultado && theme && (
          <div className="mt-6 w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <p className="text-center text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
              ¿Dónde depositarlo?
            </p>

            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
              {/* Tres contenedores */}
              <div className="flex items-end justify-between gap-4 mb-6">
                {([
                  { key: 'PAPEL_CARTON', label: 'Papel / Cartón', pos: 'IZQUIERDA', color: '#6B7280', bg: '#F3F4F6', icon: '📄' },
                  { key: 'PLASTICO',     label: 'Plástico',        pos: 'CENTRO',    color: '#3B82F6', bg: '#EFF6FF', icon: '♻️' },
                  { key: 'ORGANICO',     label: 'Orgánico',        pos: 'DERECHA',   color: '#22C55E', bg: '#F0FDF4', icon: '🌿' },
                ] as const).map((bin) => {
                  const isActive = bin.key === resultado.contenedor;
                  return (
                    <div
                      key={bin.key}
                      className={cn(
                        'flex-1 flex flex-col items-center gap-2 rounded-xl py-5 px-3 transition-all duration-500',
                        isActive ? 'shadow-xl' : 'opacity-35'
                      )}
                      style={{
                        backgroundColor: isActive ? bin.bg : '#F9FAFB',
                        border: `2px solid ${isActive ? bin.color : '#E5E7EB'}`,
                        transform: isActive ? 'scale(1.08)' : 'scale(1)',
                      }}
                    >
                      <span className="text-4xl">{bin.icon}</span>
                      <span className="text-xs font-black uppercase tracking-widest mt-1" style={{ color: bin.color }}>
                        {bin.label}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">{bin.pos}</span>
                    </div>
                  );
                })}
              </div>

              {/* Flecha de dirección */}
              <div className="flex items-center justify-center">
                {resultado.contenedor === 'PAPEL_CARTON' && (
                  <div className="flex items-center gap-1 text-gray-600 animate-[arrowPulseLeft_0.9s_ease-in-out_infinite]">
                    <ArrowLeft className="w-12 h-12" />
                    <ArrowLeft className="w-9 h-9 opacity-60" />
                    <ArrowLeft className="w-6 h-6 opacity-30" />
                    <span className="ml-3 text-xl font-black tracking-tight" style={{ color: '#6B7280' }}>
                      Deposita a la IZQUIERDA
                    </span>
                  </div>
                )}

                {resultado.contenedor === 'PLASTICO' && (
                  <div className="flex flex-col items-center gap-2 text-blue-600 animate-[arrowPulseDown_0.9s_ease-in-out_infinite]">
                    <span className="text-xl font-black tracking-tight">Deposita al CENTRO</span>
                    <div className="flex gap-1">
                      <ArrowDown className="w-6 h-6 opacity-30" />
                      <ArrowDown className="w-9 h-9 opacity-60" />
                      <ArrowDown className="w-12 h-12" />
                      <ArrowDown className="w-9 h-9 opacity-60" />
                      <ArrowDown className="w-6 h-6 opacity-30" />
                    </div>
                  </div>
                )}

                {resultado.contenedor === 'ORGANICO' && (
                  <div className="flex items-center gap-1 text-green-600 animate-[arrowPulseRight_0.9s_ease-in-out_infinite]">
                    <span className="mr-3 text-xl font-black tracking-tight" style={{ color: '#22C55E' }}>
                      Deposita a la DERECHA
                    </span>
                    <ArrowRight className="w-6 h-6 opacity-30" />
                    <ArrowRight className="w-9 h-9 opacity-60" />
                    <ArrowRight className="w-12 h-12" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center gap-4">
          {cameraActive ? (
            <button
              onClick={stopSystem}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors shadow-lg"
            >
              <Square className="w-5 h-5" />
              Detener Cámara Web
            </button>
          ) : (
            <button
              onClick={startSystem}
              disabled={!yoloServiceAvailable}
              className={cn(
                "flex items-center gap-2 px-6 py-3 text-white rounded-xl font-bold transition-colors shadow-lg",
                yoloServiceAvailable 
                  ? "bg-green-500 hover:bg-green-600" 
                  : "bg-gray-400 cursor-not-allowed"
              )}
            >
              <Play className="w-5 h-5" />
              Iniciar Cámara Web
            </button>
          )}
        </div>

        {/* ── Sección de Estadísticas ── */}
        {estadisticas && estadisticas.resumen && (
          <div className="mt-12 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Tarjeta Resumen */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">📊</span> Resumen General
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Clasificaciones Hoy</span>
                  <span className="text-xl font-black text-[#1B4332]">{estadisticas.resumen.totalClasificacionesHoy || 0}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Esta Semana</span>
                  <span className="text-xl font-black text-[#1B4332]">{estadisticas.resumen.totalClasificacionesSemana || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Confianza Promedio de IA</span>
                  <span className="text-xl font-black text-[#52B788]">{estadisticas.resumen.confianzaPromedio || 0}%</span>
                </div>
              </div>
            </div>

            {/* Tarjeta Distribución */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">📈</span> Distribución de Residuos
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-bold text-gray-700">Orgánico</span>
                      <span className="text-sm font-bold text-green-600">
                        {estadisticas.resumen.distribucionContenedores?.ORGANICO?.porcentaje || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${estadisticas.resumen.distribucionContenedores?.ORGANICO?.porcentaje || 0}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <span className="w-3 h-3 bg-gray-500 rounded-full"></span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-bold text-gray-700">Papel / Cartón</span>
                      <span className="text-sm font-bold text-gray-600">
                        {estadisticas.resumen.distribucionContenedores?.PAPEL_CARTON?.porcentaje || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-gray-500 h-2 rounded-full transition-all duration-500" style={{ width: `${estadisticas.resumen.distribucionContenedores?.PAPEL_CARTON?.porcentaje || 0}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-bold text-gray-700">Plástico</span>
                      <span className="text-sm font-bold text-blue-600">
                        {estadisticas.resumen.distribucionContenedores?.PLASTICO?.porcentaje || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${estadisticas.resumen.distribucionContenedores?.PLASTICO?.porcentaje || 0}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tarjeta Historial de Logs */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 md:col-span-2">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">📋</span> Registro en Vivo
              </h3>
              <div className="bg-[#1a1a2e] text-white p-4 rounded-xl h-60 overflow-y-auto font-mono text-sm space-y-2 flex flex-col">
                {historial.length === 0 ? (
                  <div className="text-gray-400 italic">[--:--:--] Esperando inicio de clasificaciones...</div>
                ) : (
                  historial.map((log, idx) => {
                    const time = new Date(log.timestamp || Date.now()).toLocaleTimeString();
                    const colorHex = log.contenedor === 'ORGANICO' ? '#22C55E' : log.contenedor === 'PAPEL_CARTON' ? '#6B7280' : '#3B82F6';
                    return (
                      <div key={`${log.id}-${idx}`} className="border-b border-gray-800 pb-2">
                        <span className="text-gray-400 mr-2">[{time}]</span> 
                        <span className="text-gray-300">Detectado:</span> <span className="font-bold text-[#00ff88]">{log.clase || (log as any).claseDetectada || 'objeto'}</span> 
                        <span className="text-gray-400 mx-2">→</span> 
                        <span className="font-bold" style={{ color: colorHex }}>{log.contenedor}</span> 
                        <span className="text-gray-400 ml-2">({((log.confianza || 0) * 100).toFixed(1)}% de confianza)</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>
        )}
      </main>

      <style jsx global>{`
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        @keyframes arrowPulseLeft {
          0%, 100% { transform: translateX(0);   opacity: 1; }
          50%       { transform: translateX(-8px); opacity: 0.7; }
        }
        @keyframes arrowPulseRight {
          0%, 100% { transform: translateX(0);  opacity: 1; }
          50%       { transform: translateX(8px); opacity: 0.7; }
        }
        @keyframes arrowPulseDown {
          0%, 100% { transform: translateY(0);  opacity: 1; }
          50%       { transform: translateY(6px); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
