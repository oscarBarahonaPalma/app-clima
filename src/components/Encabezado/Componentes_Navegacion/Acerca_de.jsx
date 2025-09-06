// src/components/Encabezado/Componentes_Navegacion/Acerca_de.jsx
import React from 'react';

function AcercaDe() {
  const styles = {
    container: {
      padding: '2rem',
      color: 'white',
      textAlign: 'center',
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    },
    title: {
      color: 'white',
      fontSize: '2.5rem',
      marginBottom: '1rem',
      fontWeight: 'bold',
      textShadow: '0 2px 4px rgba(0,0,0,0.3)'
    },
    text: {
      color: 'white',
      fontSize: '1.2rem',
      lineHeight: '1.6',
      maxWidth: '600px',
      margin: '0 auto',
      opacity: '0.9'
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Acerca de ⚙️</h2>
      <p style={styles.text}>Información sobre nuestra aplicación.</p>
    </div>
  );
}

// **Añade esta línea** para exportarlo como default:
export default AcercaDe;
