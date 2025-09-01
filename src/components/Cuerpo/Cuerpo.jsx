import '../../styles/Cuerpo.css'
import Ciudad_fecha_hora from './Ciudad_fecha_hora'
import ClimaActual from './ClimaActual'
import PronosticoPorHora from './PronosticoPorHora'
import PronosticoSemana from './PronosticoSemana'

function Cuerpo({ forecastData, weatherData }) {
  return (
   <div className="cuerpo">
      <div className="cuerpo__contenido">
        
        <Ciudad_fecha_hora />
        <ClimaActual />
        
        
      </div>

      
<div className='semana_oscar'>
   <PronosticoSemana forecastData={forecastData} weatherData={weatherData} />
</div>
    
    </div>
  )
}

export default Cuerpo
