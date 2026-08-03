'use client';

import { useReveal } from './useReveal';
import { IMG } from './images';

export default function Problema() {
  const ref = useReveal();

  return (
    <section className="section problema" id="problema">
      <div className="reveal problema__grid" ref={ref}>
        <div className="problema__text">
          <p className="eyebrow eyebrow--dark">El problema</p>
          <h2 className="section__title">
            La basura no se separa en origen, y nadie sabe cuándo un contenedor
            está realmente lleno.
          </h2>
          <div className="prose">
            <p>
              Cuando los residuos reciclables se mezclan desde el punto de descarte,
              el material queda contaminado y pierde su valor de reciclaje de forma
              irreversible. A eso se suma que hoy no existe un monitoreo del nivel
              de llenado de los contenedores, así que los camiones recolectan rutas
              fijas sin saber qué recipiente necesita atención y cuál no.
            </p>
            <p>
              El resultado son rutas de recolección ineficientes, contenedores que se
              desbordan mientras otros se visitan medio vacíos, y toneladas de material
              reciclable que terminan en el relleno sanitario. ÑañoClean ataca las dos
              causas a la vez: clasifica el residuo en el momento y reporta el nivel de
              cada contenedor en vivo.
            </p>
          </div>
        </div>

        <figure className="problema__figure">
          <img
            src={IMG.problema}
            alt="Contenedor de residuos urbano desbordado en la calle"
            loading="lazy"
          />
          <figcaption className="problema__caption">
            Contenedor desbordado: hoy nadie mide el nivel de llenado en tiempo real.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
