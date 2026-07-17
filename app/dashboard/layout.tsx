import type { Metadata } from 'next';
import DashboardShell from '../../components/layout/DashboardShell';

export const metadata: Metadata = {
  title: 'Dashboard · ÑañoClean',
  description: 'Panel de control en tiempo real de los contenedores y nodos ÑañoClean.',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
