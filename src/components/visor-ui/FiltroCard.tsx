import React, { useState, useRef, useEffect, memo, useCallback } from "react";
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

interface FiltroCardProps {
  title: React.ReactNode;
  children: React.ReactNode;
  initialExpanded?: boolean;
  forceRecalculate?: boolean;
}

const FiltroCard: React.FC<FiltroCardProps> = memo(({ 
  title, 
  children, 
  initialExpanded = true,
  forceRecalculate 
}) => {
    const [isExpanded, setIsExpanded] = useState(initialExpanded);
    const bodyRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState<number | 'auto'>('auto');
    const containerRef = useRef<HTMLDivElement>(null);

    // Recalcular altura cuando cambia la visibilidad forzada o los hijos
    useEffect(() => {
        if (bodyRef.current) {
            // Usar requestAnimationFrame para sincronizar con el renderizado
            requestAnimationFrame(() => {
                setContentHeight(bodyRef.current!.scrollHeight);
                
                // Disparar resize si está expandido
                if (isExpanded) {
                    window.dispatchEvent(new Event('resize'));
                }
            });
        }
    }, [children, isExpanded, forceRecalculate]); // Agregar forceRecalculate

    const toggleExpansion = useCallback(() => {
        setIsExpanded(prev => !prev);
    }, []);

    return (
        <div className="card-filtro" ref={containerRef}>
            <div 
                className="card-filtro-header"
                onClick={toggleExpansion}
                style={{ cursor: 'pointer' }}
            >
                <h5>{title}</h5>
                {isExpanded ? 
                    <FaAngleUp className="card-filtro-icono" /> : 
                    <FaAngleDown className="card-filtro-icono" />
                }
            </div>
            <div 
                ref={bodyRef}
                className="card-filtro-body"
                style={{
                    maxHeight: isExpanded ? contentHeight : 0,
                    overflow: 'hidden',
                    transition: 'max-height 0.3s ease, padding 0.3s ease, opacity 0.3s ease',
                    padding: isExpanded ? '5px 0' : '0',
                    opacity: isExpanded ? 1 : 0,
                }}
            >
                {children}
            </div>
        </div>
    );
});

export default FiltroCard;