import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalized = status.toLowerCase();

  let styles = 'bg-slate-900 text-slate-300 border-slate-800';

  if (normalized.includes('on track') || normalized.includes('acquired')) {
    styles = 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80';
  } else if (normalized.includes('active') || normalized.includes('in progress')) {
    styles = 'bg-blue-950/60 text-blue-300 border-blue-800/80';
  } else if (normalized.includes('review') || normalized.includes('pending')) {
    styles = 'bg-amber-950/60 text-amber-300 border-amber-800/80';
  } else if (normalized.includes('delayed') || normalized.includes('dispute') || normalized.includes('stay')) {
    styles = 'bg-rose-950/60 text-rose-300 border-rose-800/80';
  }

  const sizeClass = size === 'sm' ? 'text-[10px] px-1.5 py-0.5 font-mono uppercase tracking-wide' : 'text-[11px] px-2 py-0.5 font-mono uppercase tracking-wide font-medium';

  return (
    <span className={`inline-flex items-center rounded border whitespace-nowrap ${sizeClass} ${styles}`}>
      {status}
    </span>
  );
};
