import { useState } from 'react';
import '../../styles/Cuerpo.css'
import Ciudad_fecha_hora from './Ciudad_fecha_hora'
import ClimaActual from './ClimaActual'
import PronosticoPorHora from './PronosticoPorHora'
import PronosticoSemana from './PronosticoSemana'

function Cuerpo() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);

  const handleWeatherDataChange = ({ weather, forecastData }) => {
    setWeatherData(weather);
    setForecastData(forecastData);
  };

  return (
   <div className="cuerpo">
      <div className="cuerpo__contenido">
        
        <Ciudad_fecha_hora />
        <ClimaActual onWeatherDataChange={handleWeatherDataChange} />
        
        
      </div>

      
<div className='semana_oscar'>
   <PronosticoSemana forecastData={forecastData} weatherData={weatherData} />
</div>
    
    </div>
  )
}

export default Cuerpo
