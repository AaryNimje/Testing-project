'use client';

import React, { ReactNode } from 'react';

export interface ChartCardProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  statInfo?: { value: number; label: string } | string;
  chartType?: string;
  data?: Array<Record<string, unknown>>;
  dataKey?: string;
  xAxisKey?: string;
  chart?: {
    type: string;
    data: Array<Record<string, unknown>>;
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
  icon,
  // Keep these in the destructuring even though they're not used
  // so that they're removed from the ...rest props
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
        </div>
        {icon && <div>{icon}</div>}
      </div>
      {children}
    </div>
  );
}