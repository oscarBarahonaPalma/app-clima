import { NavLink } from 'react-router-dom'; // Asegúrate de importar esto
import '../../styles/Menu.css';

const Menu = ({ isOpen = false, onNavigate = () => {} }) => {
  return (
    <nav className={`menu ${isOpen ? 'open' : ''}`}>
      {/* Botón de cerrar en la parte superior derecha */}
      <button 
        className="menu-close-btn"
        onClick={onNavigate}
        aria-label="Cerrar menú"
      >
        Cerrar
      </button>
      <ul>
        <li>
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? 'activo' : '')}
            onClick={onNavigate}
          >
            Inicio
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/clima"
            className={({ isActive }) => (isActive ? 'activo' : '')}
            onClick={onNavigate}
          >
            Clima
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/contacto"
            className={({ isActive }) => (isActive ? 'activo' : '')}
            onClick={onNavigate}
          >
            Contacto
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/acerca"
            className={({ isActive }) => (isActive ? 'activo' : '')}
            onClick={onNavigate}
          >
            Acerca de
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Menu;
