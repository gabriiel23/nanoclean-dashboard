'use client';

import { useReveal } from './useReveal';
import { IMG } from './images';

const materiales = [
  { nombre: 'Carton y papel', clave: 'carton-papel', nota: 'Papel, cartón, periódicos y revistas.', img: IMG.carton_papel, alt: 'Caja de cartón' },
  { nombre: 'Plástico', clave: 'plastico', nota: 'Botellas de plástico, envases, bolsas y films.', img: IMG.plastico, alt: 'Botellas de plástico listas para reciclar' },
  { nombre: 'Organicos', clave: 'organicos', nota: 'Restos de comida, cáscaras y materia biodegradable.', img: IMG.organico, alt: 'Restos de comida' },
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
