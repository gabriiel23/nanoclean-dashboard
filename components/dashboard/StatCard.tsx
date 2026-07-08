import { ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '../../lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconBgColor: string;
  valueColor?: string;
  href?: string;
}

export default function StatCard({ title, value, icon, iconBgColor, valueColor = 'text-gray-900', href }: StatCardProps) {
  const CardContent = (
    <div className={cn(
      "bg-white px-5 py-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 transition-all",
      href && "hover:shadow-md hover:border-gray-200 cursor-pointer hover:-translate-y-0.5"
    )}>
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", iconBgColor)}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider truncate">{title}</p>
        <p className={cn("text-2xl font-bold tracking-tight leading-tight", valueColor)}>{value}</p>
      </div>
    </div>
  );

  if (href) return <Link href={href}>{CardContent}</Link>;
  return CardContent;
}
