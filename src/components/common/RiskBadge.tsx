import React from 'react';
import { RiskLevel } from '../../types';

interface RiskBadgeProps {
  level: RiskLevel | string;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md', showDot = true }) => {
  const normalized = (level || '').toString().toLowerCase().trim();
  
  let colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-300';
  let dotColor = 'bg-emerald-600';
  let label = 'LOW RISK';

  if (normalized.includes('high') || normalized === 'critical') {
    colorClasses = 'bg-rose-50 text-rose-800 border-rose-300 font-semibold';
    dotColor = 'bg-rose-600';
    label = 'HIGH RISK';
  } else if (normalized.includes('med') || normalized.includes('medium') || normalized === 'moderate') {
    colorClasses = 'bg-amber-50 text-amber-800 border-amber-300 font-medium';
    dotColor = 'bg-amber-500';
    label = 'MEDIUM RISK';
  } else {
    colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-medium';
    dotColor = 'bg-emerald-600';
    label = 'LOW RISK';
  }

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 font-mono tracking-wider',
    md: 'text-[11px] px-2 py-0.5 font-mono tracking-wider',
    lg: 'text-xs px-2.5 py-1 font-mono tracking-wider font-semibold',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-xs border whitespace-nowrap shadow-2xs select-none ${sizeClasses} ${colorClasses}`}
    >
      {showDot && <span className={`h-1.5 w-1.5 rounded-full ${dotColor} flex-shrink-0`} />}
      {label}
    </span>
  );
};

