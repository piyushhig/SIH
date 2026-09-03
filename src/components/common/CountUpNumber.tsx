import React, { useEffect, useState } from 'react';

interface CountUpNumberProps {
  value: number;
  durationMs?: number; // default 250ms (between 150-300ms)
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  formatWithCommas?: boolean;
}

/**
 * Smooth, subtle count-up animation for KPI metrics.
 * Runs strictly within 150-300ms professional duration window (default 250ms).
 */
export const CountUpNumber: React.FC<CountUpNumberProps> = ({
  value,
  durationMs = 250,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
  formatWithCommas = false,
}) => {
  const [displayValue, setDisplayValue] = useState<number>(0);

  useEffect(() => {
    // Respect reduced-motion preference if enabled
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayValue(value);
      return;
    }

    let startTimestamp: number | null = null;
    const startValue = 0;
    const targetValue = value;
    // Bound duration between 150ms and 300ms
    const clampedDuration = Math.min(300, Math.max(150, durationMs));

    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / clampedDuration, 1);

      // Ease-out cubic curve for natural smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (targetValue - startValue) * easeOut;

      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setDisplayValue(targetValue);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [value, durationMs]);

  let formattedNumber: string;
  if (decimals > 0) {
    formattedNumber = displayValue.toFixed(decimals);
  } else {
    formattedNumber = Math.round(displayValue).toString();
  }

  if (formatWithCommas) {
    const parts = formattedNumber.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    formattedNumber = parts.join('.');
  }

  return (
    <span className={className}>
      {prefix}
      {formattedNumber}
      {suffix}
    </span>
  );
};
