import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '../lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ÑañoClean',
  description: 'Sistema inteligente de gestión y clasificación de residuos urbanos basado en IoT, ESP32 y visión artificial.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={cn(inter.className, 'bg-[#F8FAF8] text-gray-800 antialiased min-h-screen')}>
        {children}
      </body>
    </html>
  );
}
