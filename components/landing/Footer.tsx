import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__row">
        <span className="footer__brand">ÑañoClean</span>
        <div className="footer__nav">
          <Link href="/dashboard" className="footer__link">Dashboard</Link>
          <Link href="/clasificacion" className="footer__link">Clasificación en vivo</Link>
        </div>
        <span className="footer__meta">
          Desplegado en nanoclean.uidehub.tech · HTTPS vía Certbot
        </span>
      </div>
    </footer>
  );
}
