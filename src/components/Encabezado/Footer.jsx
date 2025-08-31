import React from 'react';
import './Style_Menu/Footer.css';

export default function Footer({ weatherData }) {
  const locationName = weatherData?.name || '';
  const countryCode = weatherData?.sys?.country || '';
  const location = locationName ? `${locationName}${countryCode ? `, ${countryCode}` : ''}` : '';

  const updatedAt = weatherData?.dt ? new Date(weatherData.dt * 1000) : null;
  const updatedText = updatedAt
    ? updatedAt.toLocaleString('es-MX', {
        hour12: false,
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    : '';

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="brand">
          <span className="app-name">App Clima</span>
          <span className="app-version">v1.0</span>
        </div>
        <div className="meta">
          {location && <span className="location">{location}</span>}
          {updatedText && <span className="updated">Actualizado: {updatedText}</span>}
          <span className="data-source">
            Datos por <a href="https://openweathermap.org/" target="_blank" rel="noreferrer">OpenWeather</a>
          </span>
        </div>
        <div className="links">
          <a href="#" className="footer-link">Privacidad</a>
          <a href="#" className="footer-link">Términos</a>
          <a href="#" className="footer-link">Contacto</a>
        </div>
      </div>
      <div className="copyright">© {new Date().getFullYear()} App Clima</div>
    </footer>
  );
}


