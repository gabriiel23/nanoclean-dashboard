'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, CameraOff, Play, Square } from 'lucide-react';
import * as yoloApi from '../../services/yoloApi';
import { cn } from '../../lib/utils';

export default function CameraView() {
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startCamera = async () => {
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
        startClassificationLoop();
      }
    } catch (err: any) {
      console.error("Error accediendo a la cámara local:", err);
      alert(`No se pudo acceder a la cámara.\nError: ${err.name} - ${err.message}\n\nAsegúrate de que ningún otro programa esté usando la cámara.`);
    }
  };

  const stopCamera = () => {
    stopClassificationLoop();
    setCameraActive(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const startClassificationLoop = () => {
    // Procesar y enviar frame cada 500ms (2 FPS) para no saturar la red
    intervalRef.current = setInterval(async () => {
      if (!videoRef.current || !canvasRef.current) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context || video.videoWidth === 0) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const base64Image = canvas.toDataURL('image/jpeg', 0.7); // 70% calidad para optimizar peso
      
      try {
        // Enviar a Python. Python lo procesará y lo enviará al Node backend.
        await yoloApi.classifyImage(base64Image);
      } catch (err) {
        console.error("Error enviando frame a YOLO:", err);
      }
    }, 500);
  };

  const stopClassificationLoop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    // Limpieza al desmontar
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
      <h2 className="text-xl font-bold mb-6 text-gray-800 self-start flex items-center gap-2">
        <Camera className="w-5 h-5 text-[#1B4332]" />
        Cámara Web Local - NanoClean
      </h2>
      
      <div className="w-full max-w-2xl aspect-[4/3] bg-gray-900 rounded-lg shadow-lg border-2 border-gray-200 overflow-hidden relative flex items-center justify-center">
        {/* Canvas oculto para capturar frames */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        
        <video 
          ref={videoRef}
          autoPlay 
          playsInline 
          muted
          className={cn("w-full h-full object-cover transition-opacity", !cameraActive ? "opacity-0 pointer-events-none absolute" : "opacity-100")}
        />

        {!cameraActive && (
          <div className="flex flex-col items-center justify-center text-gray-400 gap-3">
             <CameraOff className="w-16 h-16 opacity-50" />
             <p className="font-medium">Cámara Inactiva</p>
          </div>
        )}
      </div>
      
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {!cameraActive ? (
          <button 
            onClick={startCamera}
            className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg active:scale-95 bg-[#52B788] hover:bg-[#40916c]"
          >
            <Play className="w-4 h-4" />
            Iniciar Cámara Web
          </button>
        ) : (
          <button 
            onClick={stopCamera}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <Square className="w-4 h-4" />
            Detener Cámara
          </button>
        )}
      </div>
    </div>
  );
}
