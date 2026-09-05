import React from 'react';

interface ProgressBarProps {
  value: number; // 0 - 100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  color?: 'blue' | 'emerald' | 'amber' | 'rose';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  size = 'md',
  showLabel = false,
  color = 'blue',
  className = '',
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  }[size];

  const colorClasses = {
    blue: 'bg-blue-600',
    emerald: 'bg-emerald-600',
    amber: 'bg-amber-500',
    rose: 'bg-rose-600',
  }[color];

  return (
    <div className={`w-full flex items-center gap-2 ${className}`}>
      <div className={`w-full bg-slate-900 rounded border border-slate-800/90 overflow-hidden ${heightClasses}`}>
        <div
          className={`h-full rounded transition-all duration-300 ${colorClasses}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-mono font-semibold text-slate-300 min-w-[3rem] text-right">
          {clamped}%
        </span>
      )}
    </div>
  );
};
