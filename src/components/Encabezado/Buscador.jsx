// src/components/Encabezado/Buscador.jsx
import { useState } from 'react';
import '../../styles/Buscador.css'

export default function Buscador({ onSearch }) {
  const [input, setInput] = useState('');
  
  const handleSubmit = e => {
    e.preventDefault();
    const ciudad = input.trim();
    if (!ciudad) return;
    onSearch(ciudad);   // 🚀 Dispara la búsqueda
    setInput('');
  };

  return (


    <div className='padre'>

      <form onSubmit={handleSubmit} className="buscador-form">
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="El tiempo en…"
      />
      <button type="submit">🔍</button>
    </form>
    </div>
    
  );
}
