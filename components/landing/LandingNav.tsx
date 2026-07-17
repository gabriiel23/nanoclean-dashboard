import Link from 'next/link';

// Cabecera de la landing: marca a la izquierda, anclas de sección y
// el botón que lleva al dashboard (la otra mitad del producto).
export default function LandingNav() {
  return (
    <nav className="lnav">
      <div className="lnav__inner">
        <a href="#top" className="lnav__brand">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
            <path d="M12 2C7 6 4 10 4 15a8 8 0 0 0 16 0c0-2-1-4-2-5 0 3-2 5-4 5 2-4 1-9-2-13z" />
          </svg>
          ÑañoClean
        </a>

        <div className="lnav__links">
          <a href="#problema">Problema</a>
          <a href="#arquitectura">Arquitectura</a>
          <a href="#clasificacion">Clasificación</a>
          <a href="#equipo">Equipo</a>
        </div>

        <Link href="/dashboard" className="lnav__cta">
          Ir al Dashboard <span aria-hidden="true">→</span>
        </Link>
      </div>
    </nav>
  );
}
