import React, { useRef, useEffect } from 'react';

const Starfall = ({ count = 120, isDark = true }) => {
  const ref = useRef();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;
    
    let stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.5 + 0.8,
      speed: Math.random() * 0.7 + 0.3
    }));

    let animationId;

    function animate() {
      ctx.clearRect(0, 0, width, height);
      for (let star of stars) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, 2 * Math.PI);
        ctx.fillStyle = isDark ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.95)';
        ctx.shadowColor = isDark ? '#fff' : '#000';
        ctx.shadowBlur = 12;
        ctx.fill();
        star.y += star.speed;
        if (star.y > height) {
          star.x = Math.random() * width;
          star.y = -2;
          star.r = Math.random() * 1.2 + 0.5;
          star.speed = Math.random() * 0.7 + 0.3;
        }
      }
      animationId = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [count, isDark]);

  return (
    <canvas
      ref={ref}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.8,
      }}
    />
  );
}

export default Starfall;
