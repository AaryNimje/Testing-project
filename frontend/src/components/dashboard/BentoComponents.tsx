'use client';

import React, { ReactNode } from 'react';
import { TrendingUp } from 'lucide-react';
import { THEME } from '@/lib/constants';

// BentoGrid Container
interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

export function BentoGrid({ children, className = '' }: BentoGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6 ${className}`}>
      {children}
    </div>
  );
}

// BentoCard Component
interface BentoCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: number;
  className?: string;
  size?: 'normal' | 'wide' | 'tall' | 'large';
  onClick?: () => void;
}

export function BentoCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className = '',
  size = 'normal',
  onClick
}: BentoCardProps) {
  const sizeClasses = {
    normal: 'col-span-1',
    wide: 'col-span-1 md:col-span-2',
    tall: 'col-span-1 row-span-2',
    large: 'col-span-1 md:col-span-2 row-span-2'
  };

  return (
    <div
      className={`${sizeClasses[size]} ${className} rounded-2xl p-6 border transition-all duration-300 hover:shadow-xl ${
        onClick ? 'cursor-pointer' : ''
      }`}
      style={{
        background: `linear-gradient(135deg, ${THEME.colors.dark.from}, ${THEME.colors.dark.via}, ${THEME.colors.dark.to})`,
        borderColor: THEME.colors.border,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = THEME.colors.hover;
        e.currentTarget.style.boxShadow = `0 20px 25px -5px rgba(139, 92, 246, 0.1), 0 10px 10px -5px rgba(139, 92, 246, 0.04)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = THEME.colors.border;
        e.currentTarget.style.boxShadow = '';
      }}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div 
          className="p-3 rounded-lg backdrop-blur-sm"
          style={{
            background: `linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2))`
          }}
        >
          <Icon className="w-6 h-6" style={{ color: THEME.colors.accent }} />
        </div>
        {trend !== undefined && (
          <span 
            className={`text-sm flex items-center space-x-1`}
            style={{ color: trend > 0 ? '#10B981' : '#EF4444' }}
          >
            <TrendingUp className={`w-4 h-4 ${trend < 0 ? 'rotate-180' : ''}`} />
            <span>{Math.abs(trend)}%</span>
          </span>
        )}
      </div>
      <h3 className="text-3xl font-bold text-white mb-2">{value}</h3>
      <p className="text-lg font-semibold" style={{ color: THEME.colors.text.secondary }}>
        {title}
      </p>
      {subtitle && (
        <p className="text-sm mt-1" style={{ color: THEME.colors.text.muted }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ChartCard Component
interface ChartCardProps {
  title: string;
  children?: ReactNode;
  className?: string;
}

export function ChartCard({ title, children, className = '' }: ChartCardProps) {
  return (
    <div
      className={`${className} rounded-2xl p-6 border transition-all duration-300`}
      style={{
        background: `linear-gradient(135deg, ${THEME.colors.dark.from}, ${THEME.colors.dark.via}, ${THEME.colors.dark.to})`,
        borderColor: THEME.colors.border,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = THEME.colors.hover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = THEME.colors.border;
      }}
    >
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div className="h-64 flex items-center justify-center" style={{ color: THEME.colors.text.muted }}>
        {children || "Chart placeholder - Connect to backend for real data"}
      </div>
    </div>
  );
}

// TableCard Component
interface TableCardProps {
  title: string;
  headers: string[];
  data: (string | ReactNode)[][];
  className?: string;
  onFilter?: () => void;
}

export function TableCard({ title, headers, data, className = '', onFilter }: TableCardProps) {
  return (
    <div
      className={`${className} rounded-2xl p-6 border transition-all duration-300`}
      style={{
        background: `linear-gradient(135deg, ${THEME.colors.dark.from}, ${THEME.colors.dark.via}, ${THEME.colors.dark.to})`,
        borderColor: THEME.colors.border,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = THEME.colors.hover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = THEME.colors.border;
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {onFilter && (
          <button 
            onClick={onFilter}
            className="transition-colors"
            style={{ color: THEME.colors.accent }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = THEME.colors.primary.to;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = THEME.colors.accent;
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: `1px solid ${THEME.colors.border}` }}>
              {headers.map((header, index) => (
                <th 
                  key={index} 
                  className="text-left py-3 px-2 text-sm font-semibold"
                  style={{ color: THEME.colors.text.secondary }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className="border-b transition-colors"
                style={{ borderColor: THEME.colors.border }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {row.map((cell, cellIndex) => (
                  <td 
                    key={cellIndex} 
                    className="py-3 px-2 text-sm"
                    style={{ color: THEME.colors.text.secondary }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}