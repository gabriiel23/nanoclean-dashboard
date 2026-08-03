import type { Metadata } from 'next';
import './landing.css';
import LandingNav from '../components/landing/LandingNav';
import Hero from '../components/landing/Hero';
import Telemetria from '../components/landing/Telemetria';
import Problema from '../components/landing/Problema';
import Arquitectura from '../components/landing/Arquitectura';
import Clasificacion from '../components/landing/Clasificacion';
import Fase from '../components/landing/Fase';
import Equipo from '../components/landing/Equipo';
import Footer from '../components/landing/Footer';

export const metadata: Metadata = {
  title: 'ÑañoClean · Gestión inteligente de residuos urbanos',
  description:
    'Sistema inteligente de gestión y clasificación de residuos urbanos basado en IoT, ESP32 y visión artificial.',
};

export default function LandingPage() {
  return (
    <div className="landing">
      <LandingNav />
      <Hero />
      <Telemetria />
      <main>
        <Problema />
        <Arquitectura />
        <Clasificacion />
        <Fase />
        <Equipo />
      </main>
      <Footer />
    </div>
  );
}
