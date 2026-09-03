import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalized = status.toLowerCase();

  let styles = 'bg-slate-100 text-slate-700 border-slate-200';

  if (normalized.includes('on track') || normalized.includes('acquired')) {
    styles = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  } else if (normalized.includes('active') || normalized.includes('in progress')) {
    styles = 'bg-blue-50 text-blue-800 border-blue-200';
  } else if (normalized.includes('review') || normalized.includes('pending')) {
    styles = 'bg-amber-50 text-amber-800 border-amber-200';
  } else if (normalized.includes('delayed') || normalized.includes('dispute') || normalized.includes('stay')) {
    styles = 'bg-rose-50 text-rose-800 border-rose-200';
  }

  const sizeClass = size === 'sm' ? 'text-[10px] px-1.5 py-0.5 font-mono uppercase tracking-wide' : 'text-[11px] px-2 py-0.5 font-mono uppercase tracking-wide font-medium';

  return (
    <span className={`inline-flex items-center rounded-xs border whitespace-nowrap shadow-2xs ${sizeClass} ${styles}`}>
      {status}
    </span>
  );
};
