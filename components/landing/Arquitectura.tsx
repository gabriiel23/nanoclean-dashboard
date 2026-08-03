'use client';

import { useReveal } from './useReveal';
import { IMG } from './images';

const rutas = [
  {
    tag: 'Ruta A',
    titulo: 'Telemetría de llenado',
    resumen:
      'El sensor ultrasónico mide la distancia hasta la superficie de residuos. El ESP32 la filtra y avisa cuando el contenedor se llena.',
    flujo: ['HC-SR04', 'ESP32', 'MQTT · TLS 8883', 'HiveMQ Cloud', 'Backend', 'Dashboard'],
    hardware: 'Sensor ultrasónico HC-SR04 + microcontrolador ESP32',
  },
  {
    tag: 'Ruta B',
    titulo: 'Clasificación por visión',
    resumen:
      'La laptop procesa el video cuadro a cuadro en el borde y clasifica cada residuo en menos de tres segundos con YOLOv8.',
    flujo: ['Webcam', 'Laptop Edge', 'YOLOv8', 'HTTPS POST', 'Backend', 'Registro histórico'],
    hardware: 'Webcam USB + laptop como nodo Edge con inferencia local',
  },
];

const protocolos = [
  { nombre: 'MQTT', uso: 'Telemetría ligera del ESP32, overhead mínimo sobre TLS.' },
  { nombre: 'HTTPS', uso: 'Envío seguro de las etiquetas de clasificación al backend.' },
  { nombre: 'WebSockets', uso: 'Actualiza el dashboard en vivo sin recargar la página.' },
];

export default function Arquitectura() {
  const ref = useReveal();

  return (
    <section className="section arch" id="arquitectura">
      <div className="reveal" ref={ref}>
        <p className="eyebrow eyebrow--dark">Cómo funciona</p>
        <h2 className="section__title">
          Una arquitectura IoT de nivel 4: decisiones en el borde, memoria en la nube.
        </h2>
        <p className="section__intro">
          El procesamiento pesado de visión ocurre localmente para responder al
          instante, mientras la nube guarda la telemetría y el histórico. El dato
          viaja por dos rutas que convergen en el backend.
        </p>

        <figure className="arch__banner">
          <img
            src={IMG.arquitectura}
            alt="Trabajo de ingeniería sobre el nodo Edge del sistema"
            loading="lazy"
          />
          <figcaption className="arch__banner-cap">
            <span className="arch__banner-dot" />
            Nodo Edge · inferencia local con YOLOv8
          </figcaption>
        </figure>

        <div className="lanes">
          {rutas.map((r) => (
            <article className="lane" key={r.tag}>
              <div className="lane__head">
                <span className="lane__tag">{r.tag}</span>
                <h3 className="lane__title">{r.titulo}</h3>
              </div>
              <p className="lane__resumen">{r.resumen}</p>
              <div className="lane__flow">
                {r.flujo.map((paso, i) => (
                  <span className="chip" key={paso}>
                    {paso}
                    {i < r.flujo.length - 1 && <span className="chip__arrow">→</span>}
                  </span>
                ))}
              </div>
              <p className="lane__hw">{r.hardware}</p>
            </article>
          ))}
        </div>

        <div className="protocols">
          {protocolos.map((p) => (
            <div className="protocol" key={p.nombre}>
              <span className="protocol__name">{p.nombre}</span>
              <span className="protocol__use">{p.uso}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
