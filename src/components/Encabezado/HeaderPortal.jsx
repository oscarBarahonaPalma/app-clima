import '../../styles/HeaderPortal.css';

// src/components/Encabezado/HeaderPortal.jsx
import ReactDOM from 'react-dom';
import Buscador from './Buscador';
import Menu from './Menu';
import LogoClima from '../LogoClima';

export default function HeaderPortal() {
  const container = document.getElementById('header-search');
  if (!container) return null;

  return ReactDOM.createPortal(
    <div className="header-portal">
      <LogoClima />
      <Menu />
    </div>,
    container
  );
}
