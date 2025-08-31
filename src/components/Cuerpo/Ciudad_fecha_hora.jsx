// src/components/Cuerpo/Ciudad_fecha_hora.jsx
import React from 'react';
import '../../styles/Ciudad_fecha_hora.css';  // Asegúrate de crear este archivo

export default function Ciudad_fecha_hora({ weather }) {
  if (!weather) return null;

  // Ajustamos el timestamp al huso local de la ciudad
  const tsLocal = (weather.dt + weather.timezone) * 1000;
  const dateObj = new Date(tsLocal);

  // Fecha y hora formateadas en UTC para no recalentarnos con husos
  const fecha = dateObj.toLocaleDateString('es-MX', {
    weekday: 'long',
    day:     'numeric',
    month:   'long',
    year:    'numeric',
    timeZone: 'UTC'
  });
  const hora = dateObj.toLocaleTimeString('es-MX', {
    hour:     '2-digit',
    minute:   '2-digit',
    timeZone: 'UTC'
  });

  return (
    <div className="tarjeta-ciudad">
      <h2 className="tarjeta-ciudad__titulo">
        {weather.name}, {weather.sys.country}
      </h2>
      <p className="tarjeta-ciudad__fecha">{fecha}</p>
      <p className="tarjeta-ciudad__hora">{hora}</p>
    </div>
  );
}
