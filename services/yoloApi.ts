import { BACKEND_URL } from '../lib/utils';

const YOLO_SERVICE_URL = 'https://api-yolo.uidehub.tech/';
const EXPRESS_URL = BACKEND_URL;

export interface CameraStatus {
  success: boolean;
  camera?: string;
  running?: boolean;
  error?: string;
}

export interface ClassifierStatus {
  success: boolean;
  running?: boolean;
  error?: string;
}

export interface ClassificationResult {
  success: boolean;
  contenedor?: string;
  color?: string;
  instruccion?: string;
  error?: string;
  detection?: {
    class: string;
    confidence: number;
    class_id: number;
    bbox?: [number, number, number, number];
  };
}

export interface InternalClasificacionPayload {
  contenedor: string;
  claseDetectada: string;
  confianza: number;
  color: string;
  instruccion: string;
  bbox?: [number, number, number, number];
}

export async function classifyImage(base64Image: string): Promise<ClassificationResult> {
  try {
    const res = await fetch(`${YOLO_SERVICE_URL}/classify/base64`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Image }),
    });
    return await res.json();
  } catch {
    return { success: false, error: 'No se pudo conectar al servicio YOLO' };
  }
}

export async function sendClasificacionToBackend(data: InternalClasificacionPayload): Promise<void> {
  try {
    await fetch(`${EXPRESS_URL}/api/clasificar/internal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.error('Error enviando clasificación al backend:', err);
  }
}

export async function startCamera(camera: string = 'droidcam'): Promise<CameraStatus> {
  try {
    const res = await fetch(`${YOLO_SERVICE_URL}/camera/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ camera }),
    });
    return await res.json();
  } catch {
    return { success: false, error: 'No se pudo conectar al servicio YOLO' };
  }
}

export async function stopCamera(): Promise<CameraStatus> {
  try {
    const res = await fetch(`${YOLO_SERVICE_URL}/camera/stop`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return await res.json();
  } catch {
    return { success: false, error: 'No se pudo conectar al servicio YOLO' };
  }
}

export async function startClassification(): Promise<ClassifierStatus> {
  try {
    const res = await fetch(`${YOLO_SERVICE_URL}/classifier/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return await res.json();
  } catch {
    return { success: false, error: 'No se pudo conectar al servicio YOLO' };
  }
}

export async function stopClassification(): Promise<ClassifierStatus> {
  try {
    const res = await fetch(`${YOLO_SERVICE_URL}/classifier/stop`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return await res.json();
  } catch {
    return { success: false, error: 'No se pudo conectar al servicio YOLO' };
  }
}

export async function updateConfidence(confidence: number): Promise<void> {
  try {
    await fetch(`${YOLO_SERVICE_URL}/camera/config`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ confidence: confidence / 100 }),
    });
  } catch (err) {
    console.error('Error actualizando confianza:', err);
  }
}

export async function getCameraStatus(): Promise<CameraStatus> {
  try {
    const res = await fetch(`${YOLO_SERVICE_URL}/camera/status`);
    return await res.json();
  } catch {
    return { success: false, error: 'No se pudo conectar al servicio YOLO' };
  }
}

export async function getClassifierStatus(): Promise<ClassifierStatus> {
  try {
    const res = await fetch(`${YOLO_SERVICE_URL}/classifier/status`);
    return await res.json();
  } catch {
    return { success: false, error: 'No se pudo conectar al servicio YOLO' };
  }
}
