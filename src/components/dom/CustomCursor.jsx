import React, { useEffect, useRef } from 'react';

export function CustomCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const moveCursor = (e) => {
      if (cursorRef.current) {
        // Mueve el div exactamente a las coordenadas del mouse
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };
    
    window.addEventListener('mousemove', moveCursor);
    
    // Ocultamos el cursor nativo
    document.body.style.cursor = 'none';
    
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.body.style.cursor = 'auto';
    };
  }, []);

  return (
    <div 
      ref={cursorRef} 
      className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-9999 -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      style={{ willChange: 'transform' }} // Optimización de rendimiento
    >
      {/* El círculo del puntero */}
      <div className="w-full h-full border border-cyan-400 rounded-full flex items-center justify-center">
        <div className="w-1 h-1 bg-white rounded-full" />
      </div>
    </div>
  );
}