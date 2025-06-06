import { ReactNode } from 'react';

export interface BentoCardProps {
  children?: ReactNode;
  title?: string;
  value?: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: { value: number; label: string } | string;
  className?: string;
}

export interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

export interface ChartCardProps {
  title: string;
  subtitle?: string;
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

export interface TableCardProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  headers?: string[];
  data?: any[][];
  columns?: { key: string; label: string }[];
  className?: string;
  children?: ReactNode;
}

export interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
  actions?: {
    label: string;
    icon?: ReactNode;
    primary?: boolean;
    onClick?: () => void;
  }[];
}