'use client';

import { useReveal } from './useReveal';
import { IMG } from './images';

const materiales = [
  { nombre: 'Orgánico', clave: 'organico', nota: 'Restos de comida y material biodegradable.', img: IMG.organico, alt: 'Manos sosteniendo tierra fértil y hojas' },
  { nombre: 'Plástico', clave: 'plastico', nota: 'Envases, botellas y films reciclables.', img: IMG.plastico, alt: 'Botellas de plástico listas para reciclar' },
  { nombre: 'Vidrio', clave: 'vidrio', nota: 'Botellas y frascos de vidrio.', img: IMG.vidrio, alt: 'Botellas de vidrio recolectadas para reciclaje' },
  { nombre: 'Metal', clave: 'metal', nota: 'Latas y envases metálicos.', img: IMG.metal, alt: 'Latas de aluminio' },
];

export default function Clasificacion() {
  const ref = useReveal();

  return (
    <section className="section clasif" id="clasificacion">
      <div className="reveal" ref={ref}>
        <p className="eyebrow eyebrow--dark">Clasificación</p>
        <h2 className="section__title">
          Cuatro categorías, decididas en el borde en menos de tres segundos.
        </h2>
        <p className="section__intro">
          El modelo YOLOv8 corre localmente sobre el video de la webcam y asigna
          cada residuo a una de estas clases. El color no es decorativo: es el
          código con el que el sistema separa el material.
        </p>

        <div className="materials">
          {materiales.map((m) => (
            <div className={'material material--' + m.clave} key={m.clave}>
              <div className="material__photo">
                <img src={m.img} alt={m.alt} loading="lazy" />
              </div>
              <div className="material__body">
                <span className="material__name">
                  <span className="material__swatch" />
                  {m.nombre}
                </span>
                <span className="material__note">{m.nota}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
