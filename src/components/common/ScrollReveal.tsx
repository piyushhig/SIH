import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
}

/**
 * High-performance, GPU-friendly scroll-reveal component using native IntersectionObserver.
 * - Initial: opacity: 0, transform: translateY(18px)
 * - Final: opacity: 1, transform: translateY(0)
 * - Duration: 400ms with smooth cubic-bezier(0.16, 1, 0.3, 1) ease-out
 * - Triggers ONCE per section; cleans up transform once settled to eliminate compositor overhead
 * - Zero layout recalculations (animates purely opacity and transform)
 * - Full prefers-reduced-motion support
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delayMs = 0,
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isSettled, setIsSettled] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect user's motion preference immediately
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsRevealed(true);
      setIsSettled(true);
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsRevealed(true);
      setIsSettled(true);
      return;
    }

    const scrollContainer = document.getElementById('main-scroll-container');

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.unobserve(element);

          // Once the 400ms transition + delay settles, remove transform & will-change
          // so the element doesn't hold persistent GPU memory during subsequent scrolling
          const timer = setTimeout(() => {
            setIsSettled(true);
          }, 450 + delayMs);

          return () => clearTimeout(timer);
        }
      },
      {
        root: scrollContainer || null,
        rootMargin: '0px 0px -24px 0px',
        threshold: 0.05,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [delayMs]);

  // Once settled, remove inline transform/willChange completely for 100% native scrolling
  const style: React.CSSProperties = isSettled
    ? { opacity: 1 }
    : {
        opacity: isRevealed ? 1 : 0,
        transform: isRevealed ? 'translateY(0)' : 'translateY(18px)',
        transition: `opacity 400ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms, transform 400ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms`,
        willChange: isRevealed ? 'opacity, transform' : 'auto',
      };

  return (
    <div
      ref={elementRef}
      style={style}
      className={className}
    >
      {children}
    </div>
  );
};

