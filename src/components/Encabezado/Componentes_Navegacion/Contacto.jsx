import { useEffect, useState } from 'react'
import '../Style_Menu/Contacto.css'

export default function Contacto() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [enviando, setEnviando] = useState(false)

  // TODO: Reemplaza con tus IDs de EmailJS (crea el servicio y plantilla en emailjs.com)
  const EMAILJS_PUBLIC_KEY = 'qZqEZJ-donpfqCWsg'
  const EMAILJS_SERVICE_ID = 'service_6l1gtrn'
  const EMAILJS_TEMPLATE_ID = 'template_a58t708'

  useEffect(() => {
    // Inicializa EmailJS si está disponible por CDN
    if (window.emailjs && EMAILJS_PUBLIC_KEY !== 'REEMPLAZA_PUBLIC_KEY') {
      window.emailjs.init(EMAILJS_PUBLIC_KEY)
    }
  }, [])

  const validarEmail = (value = '') => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setInfo('')

    if (!nombre.trim() || !email.trim() || !mensaje.trim()) {
      setError('Por favor completa todos los campos.')
      return
    }
    if (!validarEmail(email.trim())) {
      setError('Ingresa un correo válido.')
      return
    }

    if (!window.emailjs) {
      setError('No se pudo cargar el servicio de correo. Recarga la página e inténtalo de nuevo.')
      return
    }
    if (
      EMAILJS_PUBLIC_KEY === 'REEMPLAZA_PUBLIC_KEY' ||
      EMAILJS_SERVICE_ID === 'REEMPLAZA_SERVICE_ID' ||
      EMAILJS_TEMPLATE_ID === 'REEMPLAZA_TEMPLATE_ID'
    ) {
      setError('Falta configurar EmailJS (publicKey, serviceId y templateId).')
      return
    }

    try {
      setEnviando(true)
      const params = {
        from_name: nombre,
        from_email: email,
        reply_to: email,
        message: mensaje
      }
      // Asegurar inicialización y pasar public key explícitamente
      try { window.emailjs.init(EMAILJS_PUBLIC_KEY) } catch (_) {}
      const result = await window.emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        params,
        EMAILJS_PUBLIC_KEY
      )
      if (result?.status === 200) {
        setInfo('¡Mensaje enviado con éxito!')
        setNombre('')
        setEmail('')
        setMensaje('')
      } else {
        setError(`No se pudo enviar el mensaje (status: ${result?.status ?? 'desconocido'}). Inténtalo nuevamente más tarde.`)
      }
    } catch (err) {
      console.error('EmailJS error:', err)
      const detail = err?.text || err?.message || ''
      setError(`Ocurrió un error al enviar. ${detail ? 'Detalle: ' + detail : 'Revisa tu conexión e inténtalo de nuevo.'}`)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="contacto-container">
      <h2 className="contacto-titulo">Contacto</h2>
      <p className="contacto-descripcion">
        Estamos aquí para ayudarte. Si tienes alguna pregunta, sugerencia o simplemente quieres ponerte en contacto con nosotros, no dudes en escribirnos.
      </p>

      <form onSubmit={handleSubmit} style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', maxWidth: '650px' }}>
        <label htmlFor="nombre">Nombre:</label>
        <input
          id="nombre"
          type="text"
          placeholder="Tu nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <label htmlFor="email" style={{ marginTop: '1rem' }}>Correo:</label>
        <input
          id="email"
          type="email"
          placeholder="tucorreo@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="mensaje" style={{ marginTop: '1rem' }}>Mensaje:</label>
        <textarea
          id="mensaje"
          placeholder="Escribe tu mensaje aquí"
          rows={5}
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
        />

        {error && <span style={{ color: '#ff6b6b', marginTop: '0.75rem' }}>{error}</span>}
        {info && <span style={{ color: '#9be37a', marginTop: '0.75rem' }}>{info}</span>}

        <button type="submit" style={{ marginTop: '1rem' }} disabled={enviando}>
          {enviando ? 'Enviando…' : 'Enviar'}
        </button>
      </form>
    </div>
  )
}