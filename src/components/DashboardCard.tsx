import { ReactNode } from 'react';
import { cn } from '../lib/utils';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export default function DashboardCard({
  title,
  value,
  icon,
  subtitle,
  trend,
  className,
}: DashboardCardProps) {
  return (
    <div className={cn("bg-white p-6 rounded-xl shadow-sm", className)}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-2xl font-semibold mt-1">{value}</h3>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <p className={cn(
              "text-sm mt-1",
              trend.isPositive ? "text-green-600" : "text-red-600"
            )}>
              {trend.isPositive ? "+" : "-"}{trend.value}%
            </p>
          )}
        </div>
        <div className="bg-indigo-100 p-3 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );
}