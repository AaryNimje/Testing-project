// components/dashboard/ChartCard.tsx
'use client';

import React, { ReactNode } from 'react';

export interface ChartCardProps {
  title: string;
  subtitle?: string;
  value?: string | number;
  icon?: ReactNode;
  chartType?: string;
  data?: any[];
  dataKey?: string;
  xAxisKey?: string;
  chart?: {
    type: string;
    data: any[];
    dataKeys?: string[];
    dataKey?: string;
    colors?: string[];
  };
  className?: string;
  children?: ReactNode;
}

export default function ChartCard({ 
  title, 
  subtitle,
  value,
  icon,
  chartType,
  data,
  dataKey,
  xAxisKey,
  chart,
  className = '',
  children
}: ChartCardProps) {
  return (
    <div className={`p-6 rounded-xl border shadow-sm bg-white ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          {value && <div className="text-2xl font-bold">{value}</div>}
        </div>
        {icon && <div>{icon}</div>}
      </div>
      {children}
    </div>
  );
}