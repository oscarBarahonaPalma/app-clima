import React, { useState, useEffect, useMemo } from 'react';
import '../../styles/PronosticoSemana.css'; // 👈 Importa el CSS externo

// Función para obtener icono según clima y hora
const getWeatherIcon = (main, icon) => {
  const isNight = icon && icon.includes('n');
  
  switch (main.toLowerCase()) {
    case 'clear':
      return isNight ? '🌙' : '☀️';
    case 'clouds':
      return '☁️';
    case 'rain':
    case 'drizzle':
      return '🌧️';
    case 'thunderstorm':
      return '⛈️';
    case 'snow':
      return '❄️';
    default:
      return isNight ? '🌙' : '☀️';
  }
};

// Función para obtener probabilidad de lluvia
const getRainProbability = (pop) => {
  if (!pop) return '0%';
  return `${Math.round(pop * 100)}%`;
};

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

export default function PronosticoSemana({ forecastData, weatherData }) {
  const [animationTrigger, setAnimationTrigger] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const diasDinamicos = useMemo(() => generarSemana(new Date()), []);

  // Procesar datos reales del pronóstico
  const datosSemana = useMemo(() => {
    if (!forecastData || !forecastData.list) {
      // Datos por defecto si no hay datos reales
      return diasDinamicos.map((info, idx) => ({
        ...info,
        icono: '☀️',
        probLluvia: '0%',
        mm: '0.0 mm',
        max: 30,
        min: 25,
        viento: '10 - 20 km/h'
      }));
    }

    // Agrupar datos por día (cada 8 elementos = 1 día)
    const dailyData = [];
    for (let i = 0; i < Math.min(forecastData.list.length, 40); i += 8) {
      const dayForecasts = forecastData.list.slice(i, i + 8);
      if (dayForecasts.length > 0) {
        const maxTemp = Math.round(Math.max(...dayForecasts.map(f => f.main.temp_max)));
        const minTemp = Math.round(Math.min(...dayForecasts.map(f => f.main.temp_min)));
        const avgPop = dayForecasts.reduce((sum, f) => sum + (f.pop || 0), 0) / dayForecasts.length;
        const avgWind = dayForecasts.reduce((sum, f) => sum + (f.wind?.speed || 0), 0) / dayForecasts.length;
        const mainWeather = dayForecasts[0].weather[0];
        
        dailyData.push({
          icono: getWeatherIcon(mainWeather.main, mainWeather.icon),
          probLluvia: getRainProbability(avgPop),
          mm: avgPop > 0 ? `${(avgPop * 10).toFixed(1)} mm` : '0.0 mm',
          max: maxTemp,
          min: minTemp,
          viento: `${Math.round(avgWind)} - ${Math.round(avgWind * 2.5)} km/h`
        });
      }
    }

    return diasDinamicos.map((info, idx) => ({
      ...info,
      ...(dailyData[idx] || {
        icono: '☀️',
        probLluvia: '0%',
        mm: '0.0 mm',
        max: 30,
        min: 25,
        viento: '10 - 20 km/h'
      })
    }));
  }, [diasDinamicos, forecastData]);

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
