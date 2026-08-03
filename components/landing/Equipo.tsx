'use client';

import { useReveal } from './useReveal';

const integrantes = [
  { nombre: 'Denis L. Rodríguez' },
  { nombre: 'Gabriel A. Diaz' },
  { nombre: 'Nicolas A. Cevallos' },
  { nombre: 'Nicole B. Abad' },
];

function iniciales(nombre: string) {
  const partes = nombre.replace(/\./g, '').split(' ').filter(Boolean);
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

export default function Equipo() {
  const ref = useReveal();

  return (
    <section className="section equipo" id="equipo">
      <div className="reveal" ref={ref}>
        <p className="eyebrow eyebrow--dark">El equipo</p>
        <h2 className="section__title">Quiénes construyen ÑañoClean</h2>

        <div className="team">
          {integrantes.map((p) => (
            <div className="member" key={p.nombre}>
              <span className="member__avatar" aria-hidden="true">{iniciales(p.nombre)}</span>
              <span className="member__name">{p.nombre}</span>
            </div>
          ))}
        </div>

        <p className="equipo__pie">
          Universidad Internacional del Ecuador · Dominio de aplicación: Smart Cities
          y gestión ambiental
        </p>
      </div>
    </section>
  );
}
