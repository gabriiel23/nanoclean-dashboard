'use client';

import { useReveal } from './useReveal';

const columnas = [
  {
    estado: 'Validado',
    tono: 'ok',
    items: [
      'Pruebas de latencia con respuesta media de 320 ms',
      'Filtro de promedio móvil sobre 5 lecturas para aislar ruido',
    ],
  },
  {
    estado: 'En construcción',
    tono: 'wip',
    items: [
      'Nodo ESP32 publicando por MQTT seguro (TLS)',
      'Estación Edge con YOLOv8 offline sobre video en vivo',
      'Dashboard web consumiendo HiveMQ y ThingSpeak por WebSockets',
    ],
  },
  {
    estado: 'Fuera de alcance este semestre',
    tono: 'out',
    items: [
      'Contenedores con compuertas motorizadas',
      'Despliegue sobre redes celulares o WAN distribuidas',
    ],
  },
];

export default function Fase() {
  const ref = useReveal();

  return (
    <section className="section fase" id="fase">
      <div className="reveal" ref={ref}>
        <p className="eyebrow eyebrow--dark">Fase actual</p>
        <h2 className="section__title">
          Prototipo integral, en camino a la demostración de fin de semestre.
        </h2>

        <div className="board">
          {columnas.map((c) => (
            <div className={'board__col board__col--' + c.tono} key={c.estado}>
              <h3 className="board__estado">{c.estado}</h3>
              <ul className="board__list">
                {c.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
