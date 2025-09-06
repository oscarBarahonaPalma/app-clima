import '../../styles/Header.css'
import LogoClima from '../LogoClima'
import Menu from './Menu.jsx'
import Buscador from './Buscador'
import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { Menu as MenuIcon, X as CloseIcon } from 'lucide-react'

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const headerRef = useRef(null);
  const navigate = useNavigate();
  const onSearch = (city) => {
    const q = encodeURIComponent(city);
    navigate(`/?city=${q}`);
  };

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const computeCollapse = () => {
      const width = window.innerWidth;
      const overflow = el.scrollWidth > el.clientWidth + 2;
      const shouldCollapse = width < 900 || overflow;
      setCollapse(shouldCollapse);
      if (!shouldCollapse) setMenuOpen(false);
    };

    const ro = new ResizeObserver(computeCollapse);
    ro.observe(el);
    window.addEventListener('resize', computeCollapse);
    setTimeout(computeCollapse, 0);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', computeCollapse);
    };
  }, []);

  // Bloquear scroll del body cuando el menú esté abierto
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Limpiar al desmontar el componente
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [menuOpen]);

  return (
    <div ref={headerRef} className={`header ${collapse ? 'collapse' : ''}`}>
      <LogoClima />
      <div id="header-search" className="padre">
        <Buscador onSearch={onSearch} />
      </div>
      <button
        className={`hamburger ${menuOpen ? 'is-active' : ''}`}
        aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((v) => !v)}
        style={{ display: menuOpen ? 'none' : 'inline-flex' }}
      >
        <MenuIcon size={22} />
      </button>
      <Menu isOpen={menuOpen} onNavigate={() => setMenuOpen(false)} />
    </div>
  )
}

export default Header
