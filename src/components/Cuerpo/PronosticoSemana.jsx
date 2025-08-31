import React, { useState, useEffect, useMemo } from 'react';
import '../../styles/PronosticoSemana.css'; // 👈 Importa el CSS externo

const baseSemana = [
  { icono: '🌩️🌤️', probLluvia: '80%', mm: '8.2 mm', max: 40, min: 25, viento: '11 - 28 km/h' },
  { icono: '🌩️🌤️', probLluvia: '70%', mm: '3.6 mm', max: 31, min: 25, viento: '14 - 37 km/h' },
  { icono: '🌧️',     probLluvia: '40%', mm: '0.8 mm', max: 32, min: 25, viento: '17 - 41 km/h' },
  { icono: '🌤️',     probLluvia: '10%', mm: '0.0 mm', max: 33, min: 25, viento: '12 - 33 km/h' },
  { icono: '🌤️',     probLluvia: '5%',  mm: '0.0 mm', max: 34, min: 24, viento: '11 - 30 km/h' },
  { icono: '🌧️',     probLluvia: '60%', mm: '0.4 mm', max: 34, min: 25, viento: '10 - 29 km/h' },
];

function capitalizar(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function generarSemana(fechaBase = new Date()) {
  const dias = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(fechaBase);
    d.setDate(fechaBase.getDate() + i);
    const esHoy = i === 0;
    const esManiana = i === 1;
    const nombreDia = esHoy
      ? 'Hoy'
      : esManiana
        ? 'Mañana'
        : capitalizar(
            d.toLocaleDateString('es-MX', { weekday: 'long' })
          );
    const fecha = d
      .toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
      .replace('.', '');
    return { dia: nombreDia, fecha };
  });
  return dias;
}

export default function PronosticoSemana() {
  const [animationTrigger, setAnimationTrigger] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const diasDinamicos = useMemo(() => generarSemana(new Date()), []);

  const datosSemana = useMemo(
    () => diasDinamicos.map((info, idx) => ({ ...info, ...baseSemana[idx % baseSemana.length] })),
    [diasDinamicos]
  );

  useEffect(() => {
    setAnimationTrigger(true);
    
    // Detectar si es móvil
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className={`semana ${animationTrigger || isMobile ? 'animate-container' : ''}`}>
      <h3 className="H3 animate-fade-in titulo-semana-abajo">Pronóstico por semana</h3>
      {datosSemana.map((dia, index) => (
        <div
          className={`dia animate-card ${animationTrigger || isMobile ? 'animate-slide-in' : ''}`}
          key={`${dia.dia}-${dia.fecha}`}
          style={{ animationDelay: `${index * 150}ms` }}
        >
          <div className="info-fecha fade-in-element">
            <span className="nombre-dia pulse-text">{dia.dia}</span>
            <span className="fecha">{dia.fecha}</span>
          </div>

          <div className="icono weather-icon bounce-icon">{dia.icono}</div>

          <div className="lluvia rain-info">
            {dia.probLluvia && <span className="prob-lluvia shimmer-text">{dia.probLluvia}</span>}
            {dia.mm && <span className="mm-lluvia">{dia.mm}</span>}
          </div>

          <div className="temp temperature-display scale-hover">{dia.max}° / {dia.min}°</div>

          <div className="viento wind-info slide-text">{dia.viento}</div>
        </div>
      ))}
    </div>
  );
}
