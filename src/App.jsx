import { Routes, Route } from 'react-router-dom';
import Header from './components/Encabezado/Header';
import Footer from './components/Encabezado/Footer';
import Inicio from './components/Encabezado/Componentes_Navegacion/Inicio';
import Clima from './components/Encabezado/Componentes_Navegacion/Clima';
import Contacto from './components/Encabezado/Componentes_Navegacion/Contacto';
import AcercaDe from './components/Encabezado/Componentes_Navegacion/Acerca_de';



function App() {
  return (
    <div className="layout">
      <Header />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/clima" element={<Clima />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/acerca" element={<AcercaDe />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
