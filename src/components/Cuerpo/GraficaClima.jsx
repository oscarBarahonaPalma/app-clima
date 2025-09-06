import React, { useRef, useEffect, useState } from 'react';

function GraficaClima({ hourlyData, currentWeather }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  // Función para actualizar las dimensiones
  const updateDimensions = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const isMobile = window.innerWidth <= 767;
      const margin = isMobile ? 0 : 40; // Sin margen en móviles
      const maxWidth = Math.min(rect.width - margin, 800); // Máximo 800px
      const minWidth = isMobile ? 280 : 400; // Ancho mínimo más pequeño en móviles
      const finalWidth = Math.max(maxWidth, minWidth);
      const aspectRatio = 400 / 800; // Relación de aspecto original
      const height = finalWidth * aspectRatio;

      setDimensions({ width: finalWidth, height });
    }
  };

  useEffect(() => {
    // Pequeño delay para asegurar que el DOM esté listo
    const timer = setTimeout(() => {
      updateDimensions();
    }, 100);

    const handleResize = () => {
      updateDimensions();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Ejecutar updateDimensions cuando cambien los datos
  useEffect(() => {
    updateDimensions();
  }, [hourlyData]);

  useEffect(() => {
    if (!hourlyData || hourlyData.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Actualizar el tamaño del canvas
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const width = canvas.width;
    const height = canvas.height;

    // Limpiar canvas
    ctx.clearRect(0, 0, width, height);

    // Crear gradiente de fondo
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, 'rgba(30, 41, 59, 0.95)');
    bgGradient.addColorStop(1, 'rgba(15, 23, 42, 0.95)');

    // Dibujar fondo con gradiente
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Configurar estilos profesionales con tamaños responsivos
    const scaleFactor = Math.min(width / 800, height / 400);
    const fontSize = Math.max(11, Math.min(16, 13 * scaleFactor));

    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = Math.max(1, 1.5 * scaleFactor);
    ctx.font = `${fontSize}px Inter, -apple-system, BlinkMacSystemFont, sans-serif`;
    ctx.fillStyle = '#f1f5f9';

    // Obtener datos de temperatura
    const temps = hourlyData.map(item => item.main.temp);
    const maxTemp = Math.max(...temps);
    const minTemp = Math.min(...temps);
    const range = maxTemp - minTemp || 1;

    // Configurar márgenes responsivos
    const marginLeft = Math.max(40, 60 * scaleFactor);
    const marginRight = Math.max(15, 20 * scaleFactor);
    const marginTop = Math.max(30, 40 * scaleFactor);
    const marginBottom = Math.max(30, 40 * scaleFactor);
    const graphWidth = width - marginLeft - marginRight;
    const graphHeight = height - marginTop - marginBottom;

    // Dibujar ejes con estilo profesional
    ctx.beginPath();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;
    ctx.moveTo(marginLeft, marginTop);
    ctx.lineTo(marginLeft, height - marginBottom);
    ctx.lineTo(width - marginRight, height - marginBottom);
    ctx.stroke();

    // Dibujar área bajo la curva con gradiente
    ctx.beginPath();
    const areaGradient = ctx.createLinearGradient(0, marginTop, 0, height - marginBottom);
    areaGradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
    areaGradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)');

    ctx.fillStyle = areaGradient;
    hourlyData.forEach((item, index) => {
      const x = marginLeft + (index * graphWidth) / (hourlyData.length - 1);
      const y = marginTop + ((maxTemp - item.main.temp) * graphHeight) / range;

      if (index === 0) {
        ctx.moveTo(x, height - marginBottom);
        ctx.lineTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.lineTo(width - marginRight, height - marginBottom);
    ctx.closePath();
    ctx.fill();

    // Dibujar línea de temperatura con gradiente
    ctx.beginPath();
    const lineGradient = ctx.createLinearGradient(0, 0, width, 0);
    lineGradient.addColorStop(0, '#3b82f6');
    lineGradient.addColorStop(0.5, '#06b6d4');
    lineGradient.addColorStop(1, '#8b5cf6');

    ctx.strokeStyle = lineGradient;
    ctx.lineWidth = Math.max(2, 3 * scaleFactor);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    hourlyData.forEach((item, index) => {
      const x = marginLeft + (index * graphWidth) / (hourlyData.length - 1);
      const y = marginTop + ((maxTemp - item.main.temp) * graphHeight) / range;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      // Dibujar puntos con efecto glow responsivo
      const pointSize = Math.max(3, 5 * scaleFactor);
      const glowSize = Math.max(4, 6 * scaleFactor);

      const pointGradient = ctx.createRadialGradient(x, y, 0, x, y, glowSize);
      pointGradient.addColorStop(0, '#ffffff');
      pointGradient.addColorStop(0.7, '#3b82f6');
      pointGradient.addColorStop(1, 'rgba(59, 130, 246, 0.3)');

      ctx.fillStyle = pointGradient;
      ctx.beginPath();
      ctx.arc(x, y, pointSize, 0, Math.PI * 2);
      ctx.fill();

      // Borde del punto
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = Math.max(1, 2 * scaleFactor);
      ctx.stroke();
    });
    ctx.stroke();

    // Etiquetas del eje Y (temperaturas) con mejor estilo
    ctx.fillStyle = '#cbd5e1';
    ctx.textAlign = 'right';
    ctx.font = `${Math.max(10, 12 * scaleFactor)}px Inter, -apple-system, BlinkMacSystemFont, sans-serif`;
    for (let i = 0; i <= 5; i++) {
      const temp = maxTemp - (range * i) / 5;
      const y = marginTop + (i * graphHeight) / 5;

      // Fondo sutil para las etiquetas
      const labelWidth = ctx.measureText(`${Math.round(temp)}°`).width;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
      ctx.fillRect(marginLeft - labelWidth - 16, y - 8, labelWidth + 8, 16);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`${Math.round(temp)}°`, marginLeft - 10, y + 4);
    }

    // Etiquetas del eje X (horas) con mejor estilo
    ctx.textAlign = 'center';
    ctx.font = `${Math.max(9, 11 * scaleFactor)}px Inter, -apple-system, BlinkMacSystemFont, sans-serif`;
    hourlyData.forEach((item, index) => {
      const x = marginLeft + (index * graphWidth) / (hourlyData.length - 1);
      const date = new Date(item.dt * 1000);
      const hour = date.getHours();

      // Fondo para etiquetas de hora
      const labelText = `${hour}:00`;
      const labelWidth = ctx.measureText(labelText).width;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
      ctx.fillRect(x - labelWidth / 2 - 4, height - marginBottom + 8, labelWidth + 8, 16);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(labelText, x, height - marginBottom + 20);
    });

    // Título con gradiente
    const titleGradient = ctx.createLinearGradient(width / 2 - 150, 0, width / 2 + 150, 0);
    titleGradient.addColorStop(0, '#f1f5f9');
    titleGradient.addColorStop(0.5, '#e2e8f0');
    titleGradient.addColorStop(1, '#f1f5f9');

    ctx.fillStyle = titleGradient;
    ctx.textAlign = 'center';
    ctx.font = `${Math.max(14, 18 * scaleFactor)}px Inter, -apple-system, BlinkMacSystemFont, sans-serif`;
    ctx.fillText('🌡️ Temperatura por Hora - Próximas 24 Horas', width / 2, 25 * scaleFactor + 10);

    // Panel de información profesional responsivo
    if (currentWeather) {
      const panelWidth = Math.max(200, Math.min(280, 280 * scaleFactor));
      const panelHeight = Math.max(60, Math.min(80, 80 * scaleFactor));
      const panelX = width - panelWidth - Math.max(10, 20 * scaleFactor);
      const panelY = Math.max(8, 15 * scaleFactor);

      // Fondo del panel con gradiente
      const panelGradient = ctx.createLinearGradient(panelX, panelY, panelX + panelWidth, panelY);
      panelGradient.addColorStop(0, 'rgba(30, 41, 59, 0.9)');
      panelGradient.addColorStop(1, 'rgba(15, 23, 42, 0.9)');

      ctx.fillStyle = panelGradient;
      ctx.fillRect(panelX, panelY, panelWidth, panelHeight);

      // Borde del panel
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
      ctx.lineWidth = 1;
      ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

      // Información dentro del panel
      ctx.fillStyle = '#f1f5f9';
      ctx.font = `${Math.max(11, 13 * scaleFactor)}px Inter, -apple-system, BlinkMacSystemFont, sans-serif`;
      ctx.textAlign = 'left';

      const currentTemp = Math.round(currentWeather.main.temp);
      const humidity = currentWeather.main.humidity;
      const windSpeed = Math.round(currentWeather.wind.speed * 10) / 10; // Una decimal

      const textSpacing = Math.max(18, 20 * scaleFactor);
      const sidePadding = Math.max(10, 15 * scaleFactor);

      ctx.fillText(`🌡️ ${currentTemp}°C`, panelX + sidePadding, panelY + textSpacing * 1.5);
      ctx.fillText(`💧 ${humidity}%`, panelX + sidePadding, panelY + textSpacing * 2.5);
      ctx.fillText(`💨 ${windSpeed} m/s`, panelX + sidePadding, panelY + textSpacing * 3.5);

      // Estadísticas de temperatura
      ctx.textAlign = 'right';
      ctx.fillStyle = '#94a3b8';
      ctx.font = `${Math.max(9, 11 * scaleFactor)}px Inter, -apple-system, BlinkMacSystemFont, sans-serif`;
      ctx.fillText(`Máx: ${Math.round(maxTemp)}°C`, panelX + panelWidth - sidePadding, panelY + textSpacing * 1.5);
      ctx.fillText(`Mín: ${Math.round(minTemp)}°C`, panelX + panelWidth - sidePadding, panelY + textSpacing * 2.5);

      // Título del panel
      ctx.fillStyle = '#cbd5e1';
      ctx.font = `${Math.max(8, 10 * scaleFactor)}px Inter, -apple-system, BlinkMacSystemFont, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('CONDICIONES ACTUALES', panelX + panelWidth / 2, panelY + Math.max(10, 12 * scaleFactor));
    }

  }, [hourlyData, currentWeather, dimensions]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        margin: '2rem 0',
        position: 'relative'
      }}
    >
      <div style={{
        width: '100%',
        height: dimensions.height + 'px',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), 0 8px 16px rgba(0, 0, 0, 0.2)',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))',
        position: 'relative'
      }}>
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          style={{
            display: 'block',
            width: '100%',
            height: '100%'
          }}
        />
        {/* Efecto de brillo superior */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, #3b82f6, #06b6d4, #8b5cf6)',
          opacity: 0.8
        }} />
      </div>
    </div>
  );
}

export default GraficaClima;
