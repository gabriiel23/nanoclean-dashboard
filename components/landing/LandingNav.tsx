'use client';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollToPlugin);
}

// Cabecera de la landing: marca a la izquierda, anclas de sección y
// el botón que lleva al dashboard (la otra mitad del producto).
export default function LandingNav() {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (id === 'top') {
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: 0 },
        ease: 'power3.inOut'
      });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: el, offsetY: 68 }, // 68px de offset para la cabecera fija
        ease: 'power3.inOut'
      });
    }
  };

  return (
    <nav className="lnav">
      <div className="lnav__inner">
        <a href="#top" className="lnav__brand" onClick={(e) => handleScroll(e, 'top')}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
            <path d="M12 2C7 6 4 10 4 15a8 8 0 0 0 16 0c0-2-1-4-2-5 0 3-2 5-4 5 2-4 1-9-2-13z" />
          </svg>
          ÑañoClean
        </a>

        <div className="lnav__links">
          <a href="#problema" onClick={(e) => handleScroll(e, 'problema')}>Problema</a>
          <a href="#arquitectura" onClick={(e) => handleScroll(e, 'arquitectura')}>Arquitectura</a>
          <a href="#clasificacion" onClick={(e) => handleScroll(e, 'clasificacion')}>Clasificación</a>
          <a href="#equipo" onClick={(e) => handleScroll(e, 'equipo')}>Equipo</a>
        </div>

        <Link href="/dashboard" className="lnav__cta">
          Ir al Dashboard <span aria-hidden="true">→</span>
        </Link>
      </div>
    </nav>
  );
}
