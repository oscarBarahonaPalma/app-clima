import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Buscador from '../Encabezado/Buscador';
import PronosticoPorHora from './PronosticoPorHora';
import '../../styles/ClimaActual.css';

// Componente de la tarjeta de clima
function WeatherCard({ weather, updatedAt }) {
  const clima = weather.weather[0].main.toLowerCase();
  const icon = weather.weather[0].icon;
  const isNight = icon && icon.includes('n');
  
  const iconos = {
    clear: isNight ? '🌙' : '☀️',
    clouds: isNight ? '☁️' : '☁️',
    rain: '🌧️',
    drizzle: '🌧️',
    thunderstorm: '⛈️',
    snow: '❄️',
  };
  const textos = {
    clear: isNight ? 'Despejado' : 'Soleado',
    clouds: 'Nublado',
    rain: 'Lluvioso',
    drizzle: 'Llovizna',
    thunderstorm: 'Tormenta',
    snow: 'Nevado',
  };
  const icono = iconos[clima] || '❔';
  const texto = textos[clima] || weather.weather[0].description;

  const fecha = new Date(updatedAt).toLocaleDateString('es-MX', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  const hora = new Date(updatedAt).toLocaleTimeString('es-MX', {
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <div className={`tarjeta-clima ${clima} ${isNight ? 'night' : ''}`}>
      <header className="tc-header">
        <p className="tc-location">📍 {weather.name}, {weather.sys.country}</p>
        <p className="tc-datetime">{`${fecha}, ${hora}`}</p>
      </header>

      <div className="tc-main">
        <div className="tc-icon">{icono}</div>
        <p className="tc-temp">{Math.round(weather.main.temp)}°</p>
        <p className="tc-desc">{texto}</p>
      </div>

      <div className="tc-metrics">
        <div className="metric">
          <span className="m-icon">🌡️</span>
          <span><strong>{Math.round(weather.main.temp)}°</strong><br />Temperatura</span>
        </div>
        <div className="metric">
          <span className="m-icon">💧</span>
          <span><strong>{weather.main.humidity}%</strong><br />Humedad</span>
        </div>
        <div className="metric">
          <span className="m-icon">💨</span>
          <span><strong>{weather.wind.speed} m/s</strong><br />Viento</span>
        </div>
        <div className="metric">
          <span className="m-icon">{icono}</span>
          <span><strong>{texto}</strong><br />Condición</span>
        </div>
      </div>

      <footer className="tc-footer">
        <span className="dot"></span> Actualizado ahora
      </footer>
    </div>
  );
}

// Función para traducir el tipo de clima a clase CSS
const traducirClima = (main, icon) => {
  // Verificar si es de día o noche basado en el icono
  const isNight = icon && icon.includes('n');
  
  switch (main.toLowerCase()) {
    case 'clear': 
      return isNight ? 'clear-night' : 'sunny';
    case 'clouds': 
      return isNight ? 'cloudy-night' : 'cloudy';
    case 'rain':
    case 'drizzle': 
      return isNight ? 'rainy-night' : 'rainy';
    case 'thunderstorm': 
      return isNight ? 'stormy-night' : 'stormy';
    default: 
      return isNight ? 'clear-night' : 'sunny';
  }
};

export default function ClimaActual({ onWeatherDataChange }) {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const [city, setCity] = useState('Detectando ubicación...');
  const [weather, setWeather] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationDetected, setLocationDetected] = useState(false);

  // Fetch de datos
  useEffect(() => {
    if (!locationDetected || city === 'Detectando ubicación...') {
      return; // No hacer fetch hasta que la ubicación esté detectada
    }

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

        // Ejecutar ambas llamadas en paralelo para mayor velocidad
        const [respNow, respF] = await Promise.all([
          fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&lang=es&appid=${apiKey}`),
          fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&lang=es&appid=${apiKey}`)
        ]);

        if (!respNow.ok) throw new Error(`Now: ${respNow.status} ${respNow.statusText}`);
        if (!respF.ok) throw new Error(`Forecast: ${respF.status} ${respF.statusText}`);

        const [dataNow, dataF] = await Promise.all([
          respNow.json(),
          respF.json()
        ]);

        setWeather(dataNow);
        setForecastData(dataF);
        setHourlyData(dataF.list.slice(0, 8));
      } catch (err) {
        setError(err.message);
        setWeather(null);
        setHourlyData([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [city, locationDetected]);

  // Detectar ubicación automáticamente
  useEffect(() => {
    const detectLocation = async () => {
      // Si hay una ciudad en la URL, usarla
      const qCity = new URLSearchParams(location.search).get('city');
      if (qCity) {
        setCity(qCity);
        setLocationDetected(true);
        return;
      }

      // Si no hay ciudad en URL, detectar ubicación automáticamente
      if (navigator.geolocation) {
        try {
          setLoading(true);
          setCity('Detectando ubicación...');
          
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 300000 // 5 minutos
            });
          });

          const { latitude, longitude } = position.coords;
          
          // Obtener nombre de la ciudad usando coordenadas
          const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
          const reverseGeocodeUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`;
          
          const response = await fetch(reverseGeocodeUrl);
          if (response.ok) {
            const data = await response.json();
            if (data.length > 0) {
              const detectedCity = data[0].name;
              setCity(detectedCity);
              setLocationDetected(true);
            } else {
              setCity('Cancún'); // Fallback
              setLocationDetected(true);
            }
          } else {
            setCity('Cancún'); // Fallback
            setLocationDetected(true);
          }
        } catch (error) {
          console.log('Error detecting location:', error);
          setCity('Cancún'); // Fallback
          setLocationDetected(true);
        } finally {
          setLoading(false);
        }
      } else {
        // Si no hay geolocalización disponible
        setCity('Cancún');
        setLocationDetected(true);
      }
    };

    detectLocation();
  }, [location.search]);

  // Sync city when query param changes
  useEffect(() => {
    const qCity = new URLSearchParams(location.search).get('city');
    if (qCity && qCity !== city) {
      setCity(qCity);
      setLocationDetected(true);
    }
  }, [location.search, city]);

  // Aplica clase dinámica a .layout
  useEffect(() => {
    if (weather?.weather[0]?.main) {
      const tipoClima = traducirClima(weather.weather[0].main, weather.weather[0].icon);
      const layout = document.querySelector('.layout');
      if (layout) {
        layout.classList.remove('sunny', 'cloudy', 'rainy', 'stormy', 'clear-night', 'cloudy-night', 'rainy-night', 'stormy-night', 'day', 'night', 'warm', 'cool');
        layout.classList.add(tipoClima);

        // Tema día / noche usando timestamps de OpenWeather (UTC)
        const nowUtc = weather.dt;
        const sunriseUtc = weather.sys?.sunrise ?? 0;
        const sunsetUtc = weather.sys?.sunset ?? 0;
        const isDay = nowUtc >= sunriseUtc && nowUtc < sunsetUtc;
        layout.classList.add(isDay ? 'day' : 'night');

        // Tono cálido / frío según sensación térmica (metric)
        const feelsLike = weather.main?.feels_like ?? weather.main?.temp;
        if (typeof feelsLike === 'number') {
          if (feelsLike >= 29) {
            layout.classList.add('warm');
          } else if (feelsLike <= 17) {
            layout.classList.add('cool');
          }
        }
      }
    }
  }, [weather]);

  // Pasar datos al componente padre para el pronóstico semanal
  useEffect(() => {
    if (onWeatherDataChange && (weather || forecastData)) {
      onWeatherDataChange({ weather, forecastData });
    }
  }, [weather, forecastData, onWeatherDataChange]);

  return (
    <>
      {/* Buscador móvil: visible solo en pantallas pequeñas por CSS */}
      <div className="buscador-movil">
        <Buscador onSearch={(q) => navigate(`/?city=${encodeURIComponent(q)}`)} />
      </div>

     {/* Efectos visuales */}
<div className="efectos-clima">

        {/* Burbujas flotantes */}
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>

        {/* Partículas flotantes */}
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>

        {/* Gotas de lluvia */}
        {weather && (traducirClima(weather.weather[0].main, weather.weather[0].icon) === 'rainy' || traducirClima(weather.weather[0].main, weather.weather[0].icon) === 'rainy-night') &&
          [...Array(20)].map((_, i) => (
            <div key={i} className="rain-drop"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random()}s`,
                animationDuration: `${0.5 + Math.random() * 0.5}s`
              }} />
          ))
        }

        {/* Rayos */}
        {weather && (traducirClima(weather.weather[0].main, weather.weather[0].icon) === 'stormy' || traducirClima(weather.weather[0].main, weather.weather[0].icon) === 'stormy-night') && (
          <>
            <div className="lightning" style={{ left: '25%' }} />
            <div className="lightning" style={{ left: '70%' }} />
          </>
        )}

        {/* Rayos de sol */}
        {weather && traducirClima(weather.weather[0].main, weather.weather[0].icon) === 'sunny' &&
          [...Array(8)].map((_, i) => (
            <div key={`sun-ray-${i}`} className="sun-ray"
              style={{
                left: `${10 + (i * 10)}%`,
                top: `${5 + (i * 5)}%`,
                transform: `rotate(${i * 45}deg)`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }} />
          ))
        }
      </div>

      {/* Contenido */}
      <div className="clima-actual">
        {error && <p className="error">¡Ups!: {error}</p>}
        {weather && (
          <>
            <WeatherCard weather={weather} updatedAt={Date.now()} />
            <PronosticoPorHora hourly={hourlyData} weather={weather} />
          </>
        )}
      </div>
    </>
  );
}
