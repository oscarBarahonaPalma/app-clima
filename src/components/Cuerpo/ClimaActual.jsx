import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PronosticoPorHora from './PronosticoPorHora';
import '../../styles/ClimaActual.css';

// Componente de la tarjeta de clima
function WeatherCard({ weather, updatedAt }) {
  const clima = weather.weather[0].main.toLowerCase();
  const iconos = {
    clear: '☀️',
    clouds: '☁️',
    rain: '🌧️',
    drizzle: '🌧️',
    thunderstorm: '⛈️',
    snow: '❄️',
  };
  const textos = {
    clear: 'Soleado',
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
    <div className={`tarjeta-clima ${clima}`}>
      <header className="tc-header">
        <p className="tc-location">📍 {weather.name}</p>
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


export default function ClimaActual() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const initialCity = params.get('city') || 'Cancún';
  const [city, setCity] = useState(initialCity);
  const [weather, setWeather] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch de datos
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

        const urlNow = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&lang=es&appid=${apiKey}`;
        const respNow = await fetch(urlNow);
        if (!respNow.ok) throw new Error(`Now: ${respNow.status} ${respNow.statusText}`);
        const dataNow = await respNow.json();
        setWeather(dataNow);

        const urlF = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&lang=es&appid=${apiKey}`;
        const respF = await fetch(urlF);
        if (!respF.ok) throw new Error(`Forecast: ${respF.status} ${respF.statusText}`);
        const dataF = await respF.json();
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
  }, [city]);

  // Sync city when query param changes
  useEffect(() => {
    const qCity = new URLSearchParams(location.search).get('city');
    if (qCity && qCity !== city) {
      setCity(qCity);
    }
  }, [location.search]);


  return (
    <>
      {/* Contenido */}
      <div className="clima-actual">
        {loading && <p>Cargando… ⏳</p>}
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
