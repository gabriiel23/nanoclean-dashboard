'use client';

import { useEffect, useState } from 'react';
import { IMG } from './images';

export default function Hero() {
  // Animación única del medidor de llenado al cargar la página.
  const [fill, setFill] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setFill(87);
      return;
    }
    const t = setTimeout(() => setFill(87), 250);
    return () => clearTimeout(t);
  }, []);

  return (
    <header className="hero" id="top">
      <div
        className="hero__photo"
        aria-hidden="true"
        style={{ backgroundImage: `url(${IMG.heroBins})` }}
      />
      <div className="hero__grid">
        <div className="hero__copy">
          <p className="eyebrow">
            Smart Cities <span className="eyebrow__dot" /> Gestión ambiental por IoT
          </p>

          <h1 className="hero__title">ÑañoClean</h1>

          <p className="hero__lede">
            Sistema inteligente de gestión y clasificación de residuos urbanos.
            Mide el nivel de llenado de los contenedores en tiempo real y clasifica
            cada residuo con visión artificial, para reciclar mejor y recolectar
            solo cuando hace falta.
          </p>

          <div className="hero__tag">
            <span className="hero__lock" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="4" y="10" width="16" height="10" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>
            </span>
            <span className="hero__url">nanoclean.uidehub.tech</span>
          </div>
        </div>

        <div className="hero__panel" aria-hidden="true">
          <div className="gauge">
            <div className="gauge__head">
              <span className="gauge__label">Nivel de llenado</span>
              <span className="gauge__pct">{fill}%</span>
            </div>
            <div className="gauge__track">
              <div
                className={'gauge__fill' + (fill >= 85 ? ' gauge__fill--alert' : '')}
                style={{ height: fill + '%' }}
              />
              <div className="gauge__threshold">
                <span className="gauge__threshold-label">85%</span>
              </div>
            </div>
            <div className="gauge__foot">
              <span>HC-SR04</span>
              <span className={fill >= 85 ? 'gauge__state gauge__state--on' : 'gauge__state'}>
                {fill >= 85 ? 'CONTENEDOR LLENO' : 'EN RANGO'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
