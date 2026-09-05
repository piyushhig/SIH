import React from 'react';
import { RiskLevel } from '../../types';

interface RiskBadgeProps {
  level: RiskLevel | string;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md', showDot = true }) => {
  const normalized = (level || '').toString().toLowerCase().trim();
  
  let colorClasses = 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80 font-medium';
  let dotColor = 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]';
  let label = 'LOW RISK';

  if (normalized.includes('high') || normalized === 'critical') {
    colorClasses = 'bg-rose-950/70 text-rose-300 border-rose-800/90 font-semibold';
    dotColor = 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.7)] animate-pulse';
    label = 'HIGH RISK';
  } else if (normalized.includes('med') || normalized.includes('medium') || normalized === 'moderate') {
    colorClasses = 'bg-amber-950/70 text-amber-300 border-amber-800/80 font-medium';
    dotColor = 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]';
    label = 'MEDIUM RISK';
  } else {
    colorClasses = 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80 font-medium';
    dotColor = 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]';
    label = 'LOW RISK';
  }

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 font-mono tracking-wider',
    md: 'text-[11px] px-2 py-0.5 font-mono tracking-wider',
    lg: 'text-xs px-2.5 py-1 font-mono tracking-wider font-semibold',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border whitespace-nowrap select-none ${sizeClasses} ${colorClasses}`}
    >
      {showDot && <span className={`h-1.5 w-1.5 rounded-full ${dotColor} flex-shrink-0`} />}
      {label}
    </span>
  );
};

