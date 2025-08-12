// hooks/useElementVisibility.ts
import { useState, useEffect, type RefObject } from "react";

export const useElementVisibility = (ref: RefObject<HTMLElement>) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        
        if (entry.isIntersecting) {
          setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
          }, 100);
        }
      },
      { threshold: 0.1 }
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
  }, [ref]);

  return isVisible;
};