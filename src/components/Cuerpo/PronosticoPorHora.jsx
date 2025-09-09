import React, { useRef, useState } from 'react';
import { ChevronRight, ChevronLeft, Sun, Cloud, CloudRain } from 'lucide-react';
import '../../styles/PronosticoPorHora.css'

export default function PronosticoPorHora({ hourly, weather }) {
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const scrollDerecha = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 150, behavior: 'smooth' });
    }
  };

  const scrollIzquierda = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -150, behavior: 'smooth' });
    }
  };

  // Datos de ejemplo si no se proporcionan
  const defaultHourly = [
    { dt: Date.now() / 1000 + 0 * 3600, main: { temp: 28 }, weather: [{ icon: '01d', description: 'soleado' }] },
    { dt: Date.now() / 1000 + 1 * 3600, main: { temp: 29 }, weather: [{ icon: '01d', description: 'soleado' }] },
    { dt: Date.now() / 1000 + 2 * 3600, main: { temp: 29 }, weather: [{ icon: '01d', description: 'soleado' }] },
    { dt: Date.now() / 1000 + 3 * 3600, main: { temp: 30 }, weather: [{ icon: '01d', description: 'soleado' }] },
    { dt: Date.now() / 1000 + 4 * 3600, main: { temp: 30 }, weather: [{ icon: '02d', description: 'parcialmente nublado' }] },
    { dt: Date.now() / 1000 + 5 * 3600, main: { temp: 30 }, weather: [{ icon: '03d', description: 'nublado' }] },
    { dt: Date.now() / 1000 + 6 * 3600, main: { temp: 30 }, weather: [{ icon: '04d', description: 'muy nublado' }] },
  ];

  const weatherData = hourly || defaultHourly;

  const getWeatherIcon = (iconCode) => {
    if (iconCode.includes('01')) return <Sun className="icon-24 amarillo" />;
    if (iconCode.includes('02') || iconCode.includes('03') || iconCode.includes('04')) return <Cloud className="icon-24 gris" />;
    if (iconCode.includes('09') || iconCode.includes('10')) return <CloudRain className="icon-24 gris" />; // lluvia → gris
    return <Sun className="icon-24 amarillo" />;
  };

  const mapIconToCond = (iconCode = '') => {
    if (iconCode.includes('01')) return 'sunny';
    if (iconCode.includes('02') || iconCode.includes('03') || iconCode.includes('04')) return 'cloudy';
    if (iconCode.includes('09') || iconCode.includes('10')) return 'rainy';
    if (iconCode.includes('11')) return 'stormy';
    return 'sunny';
  };


  const buildTitulo = () => {
    return 'Pronóstico por hora';
  };

  const getWeatherType = () => {
    const main = weather?.weather?.[0]?.main?.toLowerCase() || '';
    if (main.includes('rain') || main.includes('drizzle')) return 'Lluvia';
    if (main.includes('thunder')) return 'Tormenta';
    if (main.includes('cloud')) return 'Nublado';
    if (main.includes('clear')) return 'Soleado';
    return '';
  };

  if (!weatherData || weatherData.length === 0) return null;

  return (
    <div className="por-hora relative-box">
      <div className="contenido-superpuesto">
        <h3 className="H3 animate-fade-in">{buildTitulo()}</h3>
        {getWeatherType() && (
          <p className="weather-type-subtitle">{getWeatherType()}</p>
        )}

        <div className="contenedor-slider relative-box">
          <div
            className="horas scrollbar-hide"
            ref={scrollRef}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {weatherData.map((h, index) => {
              const hora = new Date(h.dt * 1000).getHours().toString().padStart(2, '0');
              const temp = Math.round(h.main.temp);
              const cond = mapIconToCond(h?.weather?.[0]?.icon || '');

              return (
                <div
                  className={`hora tarjeta-hora ${cond} animate-slide-up`}
                  key={h.dt || index}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <p className="hora-texto">
                    {hora}:00
                  </p>

                  <div className={`icono-hora ${cond}`}>
                    {h.weather && h.weather[0] ? getWeatherIcon(h.weather[0].icon) : <Sun className="icon-24 amarillo" />}
                  </div>

                  <p className="temp-texto">
                    {temp}°
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
