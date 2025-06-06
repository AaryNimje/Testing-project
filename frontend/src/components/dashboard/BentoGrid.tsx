// components/dashboard/BentoGrid.tsx
'use client';

import React, { ReactNode } from 'react';

export interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

export default function BentoGrid({ children, className = '' }: BentoGridProps) {
  return (
    <div className={`grid ${className}`}>
      {children}
    </div>
  );
}