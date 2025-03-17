
import { useEffect, useRef, useState } from 'react';

// Intersection Observer hook for animations
export function useInView(options = { threshold: 0.1, triggerOnce: true }) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (options.triggerOnce && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!options.triggerOnce) {
          setIsInView(false);
        }
      },
      { threshold: options.threshold }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options.threshold, options.triggerOnce]);

  return { ref, isInView };
}

// Format price with commas and optional currency symbol
export function formatPrice(price: number, currency = '$'): string {
  return `${currency}${price.toLocaleString()}`;
}

// Staggered animation helper
export function getStaggerDelay(index: number, baseDelay = 100): number {
  return index * baseDelay;
}
