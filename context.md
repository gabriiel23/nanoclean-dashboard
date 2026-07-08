# ÑañoClean — Web Application Context

## Descripción del proyecto
ÑañoClean es un sistema IoT de clasificación y monitoreo de residuos urbanos.
Combina un sensor ultrasónico (ESP32 + HC-SR04) para medir el nivel de llenado
de contenedores, y un clasificador de visión computacional (YOLOv8) para
identificar el tipo de residuo. Los datos se transmiten via MQTT (HiveMQ Cloud)
y se visualizan en este dashboard web en tiempo real.

## Stack tecnológico
- **Frontend:** Next.js (App Router), Tailwind CSS
- **Comunicación tiempo real:** WebSockets
- **Broker MQTT:** HiveMQ Cloud (TLS 8883)
- **Almacenamiento histórico:** ThingSpeak REST API
- **Hardware:** ESP32 + HC-SR04, laptop con webcam + YOLOv8

## Paleta de colores (confirmada por diseño)
- Verde primario: `#1B4332` — logo, texto activo sidebar
- Menta / verde acento: `#52B788` — sidebar item activo, barras llenado bajo, badges online, gráfica
- Fondo general: `#F8FAF8` — blanco roto con toque sage
- Blanco: `#FFFFFF` — fondo de cards y sidebar
- Ámbar: `#F4A261` — barra de llenado nivel medio (ej. 72%)
- Rojo: `#E63946` — barra llenado crítico, badge LLENO, texto "REQUIERE RECOLECCIÓN", dot alertas
- Gris neutro: `#6B7280` — texto secundario, ubicaciones, labels gráfica
- Fondo card crítica: rojo muy suave `#FFF1F1` — card contenedor en estado LLENO

## Tipografía
- Familia: Inter o Plus Jakarta Sans
- Logo: texto bold con ícono hoja verde a la izquierda
- Métricas grandes: 32–40px bold (124, 8, 1.420)
- Labels de cards: 14px regular
- Títulos de sección: 18–20px semibold

## Layout general
- Sidebar fijo a la izquierda, ancho ~220px, fondo blanco
- Contenido principal ocupa el resto del ancho
- Navbar superior dentro del contenido: título de vista + badge Online (verde) a la derecha
- Sin header global — el título cambia por vista

## Sidebar
- Logo ÑañoClean arriba (ícono hoja + texto)
- Items de navegación:
  - Dashboard (ícono grid) — estado activo: fondo menta, texto verde oscuro, rounded
  - Clasificación (ícono scanner/chart)
  - Alertas (ícono campana) — dot rojo cuando hay alertas pendientes
  - Nodos (sin ícono visible en diseño actual)
- Ajustes abajo del todo (ícono engranaje)

## Vistas de la aplicación

### 1. Dashboard `/` — Panel de Control

**Stat cards (fila superior, 3 columnas):**
- Contenedores: número total, ícono papelera en círculo verde
- Alertas Hoy: número en rojo, ícono alerta en círculo rojo suave
- Clasificaciones: número total, ícono clasificación en círculo verde
- Cards con borde suave, sombra mínima, esquinas redondeadas ~12px

**Sección "Estado de Contenedores":**
- Título a la izquierda + botón "Filtrar" con ícono a la derecha
- Grid de cards horizontales, 4 por fila en desktop
- Cada card contiene:
  - ID del contenedor (C-01, C-08, etc.) en bold
  - Porcentaje en badge esquina superior derecha
    - Verde `#52B788` si < 60%
    - Ámbar `#F4A261` si 60–84%
    - Rojo `#E63946` si ≥ 85%
  - Barra de llenado vertical a la izquierda de la card, color igual al badge
  - Ícono pin + nombre de ubicación en gris
  - Dot verde + texto "ONLINE" debajo de la ubicación
  - Si está lleno: badge rojo "LLENO" en esquina superior, texto rojo
    "REQUIERE RECOLECCIÓN" abajo, fondo card en rojo suave

**Gráfica "Historial de Llenado Global (24h)":**
- Línea verde `#52B788` con área rellena en verde muy transparente
- Eje X: horas 00:00 a 24:00
- Eje Y: 0% a 100%
- Sin grid agresivo, líneas guía muy sutiles
- Card blanca con sombra suave conteniendo la gráfica

---

### 2. Clasificación `/clasificacion`
Pantalla pública para monitor junto al contenedor.

**Componentes:**
- Texto central: "Coloca tu residuo frente a la cámara"
- Área de cámara con líneas de escaneo animadas
- Card de resultado tras clasificación:
  - Categoría: Plástico / Vidrio / Metal / Orgánico
  - Color por categoría:
    - Plástico → azul `#3B82F6`
    - Vidrio → verde `#10B981`
    - Metal → gris `#6B7280`
    - Orgánico → café `#92400E`
  - Texto grande indicando contenedor destino
  - Barra de confianza del modelo
- Card desaparece tras 5 segundos, vuelve a estado de espera

**Datos via WebSocket:**
- `v1/residuos/clasificacion/resultado` → dispara card de resultado

---

### 3. Alertas `/alertas`
Historial de alertas del sistema.

**Componentes:**
- Dot rojo en sidebar indica alertas pendientes
- Filtros: Todas / Pendientes / Resueltas
- Lista de alertas con:
  - ID contenedor y ubicación
  - Tipo: LLENO / OFFLINE / ADVERTENCIA
  - Timestamp
  - Badge estado: pendiente (ámbar) / resuelta (verde)
  - Borde izquierdo de color según severidad

---

### 4. Nodos `/nodos`
Estado de salud de cada ESP32.

**Componentes:**
- Grid de cards por nodo:
  - Node ID y ubicación
  - Badge ONLINE (verde) / OFFLINE (rojo)
  - Señal WiFi en dBm con ícono de barras
  - Último dato recibido
  - Uptime en porcentaje
  - Estado conexión MQTT
- Cards con fondo rojo suave si offline > 10 minutos

**Datos via WebSocket:**
- `v1/residuos/sensor/heartbeat` → actualiza estado de cada nodo

---

### 5. Ajustes `/ajustes`
Configuración general del sistema. (Contenido por definir)

---

## Comportamiento general
- Todo el texto en **español**
- Diseño **responsive** (mobile + desktop)
- Sidebar colapsa en mobile
- Esquinas redondeadas: 10–14px en cards, 8px en badges
- Sombras suaves: `shadow-sm` únicamente
- Whitespace generoso entre secciones
- Dot rojo en "Alertas" del sidebar cuando hay alertas pendientes

## Mock data para desarrollo

**Contenedores:**
- C-01 — Plaza Central — 45% — ONLINE
- C-14 — Av. Principal — 72% — ONLINE
- C-08 — Parque Norte — 92% — ONLINE — LLENO / REQUIERE RECOLECCIÓN
- C-22 — Mercado Sur — 15% — ONLINE

**Stat cards:**
- Contenedores: 124
- Alertas Hoy: 8
- Clasificaciones: 1,420

## Lo que NO incluye esta versión (fuera de scope)
- Login / autenticación
- Mapa geográfico de contenedores
- Gestión de rutas de recolección
- Control remoto de contenedores
- Notificaciones push al celular