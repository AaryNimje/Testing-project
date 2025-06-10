'use client';

import React, { ReactNode } from 'react';

export interface TableCardProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  // Mark these as optional since they're not used in the component implementation
  headers?: string[];
  data?: Array<Array<unknown>>;
  columns?: Array<{ key: string; label: string }>;
  className?: string;
  children?: ReactNode;
}

export default function TableCard({ 
  title, 
  subtitle,
  icon,
  // Keeping these in the destructuring even though they're not used
  // so that they're removed from the ...rest props
  headers,
  data,
  columns,
  className = '',
  children
}: TableCardProps) {
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