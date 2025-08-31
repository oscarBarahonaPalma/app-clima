import { useState, useEffect } from 'react';
import PronosticoSemana from '../../Cuerpo/PronosticoSemana'
import PronosticoPorHora from '../../Cuerpo/PronosticoPorHora'
import '../Style_Menu/Clima.css'
// import Footer from '../Footer'

function Clima() {
  const [weatherData, setWeatherData] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);

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

  // Obtener datos del clima actual y pronóstico por hora desde localStorage o API
  useEffect(() => {
    const fetchWeatherData = async () => {
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
          // Tomar las próximas 8 horas (cada 3 horas)
          setHourlyData(dataForecast.list.slice(0, 8));
        }
      } catch (error) {
        console.log('Error fetching weather data:', error);
      }
    };

    fetchWeatherData();
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
      {/* Efectos visuales */}
      <div className="efectos-clima-clima">
        {/* Burbujas flotantes */}
        <div className="floating-element-clima"></div>
        <div className="floating-element-clima"></div>
        <div className="floating-element-clima"></div>
        <div className="floating-element-clima"></div>
        <div className="floating-element-clima"></div>

        {/* Partículas flotantes */}
        <div className="particle-clima"></div>
        <div className="particle-clima"></div>
        <div className="particle-clima"></div>
        <div className="particle-clima"></div>
        <div className="particle-clima"></div>

        {/* Gotas de lluvia */}
        {weatherData && traducirClima(weatherData.weather[0].main) === 'rainy' &&
          [...Array(20)].map((_, i) => (
            <div key={i} className="rain-drop-clima"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random()}s`,
                animationDuration: `${0.5 + Math.random() * 0.5}s`
              }} />
          ))
        }

        {/* Rayos */}
        {weatherData && traducirClima(weatherData.weather[0].main) === 'stormy' && (
          <>
            <div className="lightning-clima" style={{ left: '25%' }} />
            <div className="lightning-clima" style={{ left: '70%' }} />
          </>
        )}

        {/* Rayos de sol */}
        {weatherData && traducirClima(weatherData.weather[0].main) === 'sunny' &&
          [...Array(8)].map((_, i) => (
            <div key={`sun-ray-${i}`} className="sun-ray-clima"
              style={{
                left: `${10 + (i * 5)}%`,
                top: `${5 + (i * 5)}%`,
                transform: `rotate(${i * 45}deg)`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }} />
          ))
        }
      </div>

      {/* Pronóstico por hora (arriba) */}
      {hourlyData.length > 0 && (
        <div className="pronostico-hora-clima">
          <PronosticoPorHora hourly={hourlyData} weather={weatherData} />
        </div>
      )}

      {/* Pronóstico semanal (abajo) */}
      <PronosticoSemana />

      {/* Footer */}
      {/* <Footer weatherData={weatherData} /> */}
    </div>
  )
}

export default Clima
