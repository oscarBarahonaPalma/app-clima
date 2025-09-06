import { useState, useEffect } from 'react';
import PronosticoSemana from '../../Cuerpo/PronosticoSemana'
import PronosticoPorHora from '../../Cuerpo/PronosticoPorHora'
import GraficaClima from '../../Cuerpo/GraficaClima'
import '../Style_Menu/Clima.css'

function Clima() {
  const [weatherData, setWeatherData] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Función para traducir el tipo de clima a clase CSS
  const traducirClima = (main) => {
    switch (main.toLowerCase()) {
      case 'clear': return 'sunny';
      case 'clouds': return 'cloudy';
      case 'rain':
      case 'drizzle': return 'rainy';
      case 'thunderstorm': return 'stormy';
      default: return 'sunny';
    }
  };

  // Función para obtener datos del clima
  const fetchWeatherData = async () => {
    setLoading(true);
    try {
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
      const city = 'Cancún'; // Ciudad por defecto

      // Clima actual
      const urlNow = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&lang=es&appid=${apiKey}`;
      const responseNow = await fetch(urlNow);

      if (responseNow.ok) {
        const dataNow = await responseNow.json();
        setWeatherData(dataNow);
      }

      // Pronóstico por hora (5 días, cada 3 horas)
      const urlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&lang=es&appid=${apiKey}`;
      const responseForecast = await fetch(urlForecast);

      if (responseForecast.ok) {
        const dataForecast = await responseForecast.json();
        // Tomar las próximas 24 horas (8 intervalos de 3 horas cada uno)
        setHourlyData(dataForecast.list.slice(0, 8));
      }

      setLastUpdate(new Date());
    } catch (error) {
      console.log('Error fetching weather data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Obtener datos iniciales
  useEffect(() => {
    fetchWeatherData();
  }, []);

  // Actualización automática cada 10 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      fetchWeatherData();
    }, 10 * 60 * 1000); // 10 minutos

    return () => clearInterval(interval);
  }, []);

  // Aplicar clases de clima al contenedor
  useEffect(() => {
    if (weatherData?.weather[0]?.main) {
      const tipoClima = traducirClima(weatherData.weather[0].main);
      const climaMenu = document.querySelector('.clima_menu');
      
      if (climaMenu) {
        climaMenu.classList.remove('sunny', 'cloudy', 'rainy', 'stormy', 'day', 'night', 'warm', 'cool');
        climaMenu.classList.add(tipoClima);

        // Tema día / noche usando timestamps de OpenWeather (UTC)
        const nowUtc = weatherData.dt;
        const sunriseUtc = weatherData.sys?.sunrise ?? 0;
        const sunsetUtc = weatherData.sys?.sunset ?? 0;
        const isDay = nowUtc >= sunriseUtc && nowUtc < sunsetUtc;
        climaMenu.classList.add(isDay ? 'day' : 'night');

        // Tono cálido / frío según sensación térmica (metric)
        const feelsLike = weatherData.main?.feels_like ?? weatherData.main?.temp;
        if (typeof feelsLike === 'number') {
          if (feelsLike >= 29) {
            climaMenu.classList.add('warm');
          } else if (feelsLike <= 17) {
            climaMenu.classList.add('cool');
          }
        }
      }
    }
  }, [weatherData]);

  return (
    <div className='clima_menu'>

      {/* Primera fila: pronóstico por hora + gráfica */}
      <div className="primer-fila-clima">
        {/* Pronóstico por hora */}
        {hourlyData.length > 0 && (
          <div className="pronostico-hora-clima">
            <PronosticoPorHora hourly={hourlyData} weather={weatherData} />
          </div>
        )}

        {/* Gráfica del clima */}
        {hourlyData.length > 0 && (
          <div className="grafica-clima-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ color: 'white', margin: 0 }}>
                📊 Análisis del Clima
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {lastUpdate && (
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
                    Última actualización: {lastUpdate.toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                )}
                <button
                  onClick={fetchWeatherData}
                  disabled={loading}
                  style={{
                    background: loading
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    padding: '0.875rem 1.75rem',
                    borderRadius: '8px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    letterSpacing: '0.01em',
                    transition: 'all 0.25s ease',
                    boxShadow: loading
                      ? '0 2px 8px rgba(0, 0, 0, 0.15)'
                      : '0 2px 8px rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    transform: loading ? 'scale(0.99)' : 'scale(1)',
                    position: 'relative',
                    overflow: 'hidden',
                    opacity: loading ? 0.8 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                      e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    }
                  }}
                  onMouseDown={(e) => {
                    if (!loading) {
                      e.target.style.transform = 'scale(0.98)';
                    }
                  }}
                  onMouseUp={(e) => {
                    if (!loading) {
                      e.target.style.transform = 'scale(1)';
                    }
                  }}
                >
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    position: 'relative',
                    zIndex: 2
                  }}>
                    {loading ? (
                      <div style={{
                        width: '18px',
                        height: '18px',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        flexShrink: 0
                      }} />
                    ) : (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        style={{
                          flexShrink: 0,
                          opacity: 0.9
                        }}
                      >
                        <path
                          d="M4 12a8 8 0 018-8V2.5a.5.5 0 011 0V4a8 8 0 010 16v1.5a.5.5 0 01-1 0V20a8 8 0 01-8-8z"
                          fill="white"
                        />
                        <path
                          d="M12 2a.5.5 0 01.5.5V4a.5.5 0 01-1 0v-1.5A.5.5 0 0112 2z"
                          fill="white"
                        />
                      </svg>
                    )}
                    <span style={{
                      fontWeight: '500',
                      fontSize: '0.9rem',
                      letterSpacing: '0.025em',
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                      opacity: 0.95
                    }}>
                      {loading ? 'Actualizando datos...' : 'Actualizar'}
                    </span>
                  </span>

                </button>
              </div>
            </div>
            <GraficaClima hourlyData={hourlyData} currentWeather={weatherData} />
          </div>
        )}
      </div>

      {/* Segunda fila: pronóstico semanal */}
      <div className="segunda-fila-clima">
        <PronosticoSemana />
      </div>
    </div>
  )
}

export default Clima
