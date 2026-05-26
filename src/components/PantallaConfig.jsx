import { useState } from 'react'
import { LISTA_EMOJIS } from '../data/emojis'

export default function PantallaConfig({
  jugadores, deportes, tipoTorneo, nombreMacroTorneo,
  onSetNombre, onSetTipo,
  onAgregarJugador, onEliminarJugador,
  onAgregarDeporte, onEliminarDeporte,
  onIniciar, onAtras,
}) {
  const [nuevoNombre, setNuevoNombre] = useState('')
  const [nuevoEmoji, setNuevoEmoji] = useState('🎮')
  const [nuevoDeporte, setNuevoDeporte] = useState('')

  const handleAgregarJugador = (e) => {
    e.preventDefault()
    if (!nuevoNombre.trim()) return
    onAgregarJugador({ nombre: nuevoNombre.trim(), emoji: nuevoEmoji })
    setNuevoNombre('')
    setNuevoEmoji(LISTA_EMOJIS[Math.floor(Math.random() * LISTA_EMOJIS.length)])
  }

  const handleAgregarDeporte = (e) => {
    e.preventDefault()
    if (!nuevoDeporte.trim()) return
    onAgregarDeporte(nuevoDeporte.trim())
    setNuevoDeporte('')
  }

  return (
    <div className="tarjeta">
      <h2>📝 Planificación del Evento</h2>

      <div className="grupo-campo">
        <label>Título del Evento Principal:</label>
        <input
          type="text"
          placeholder="Ej: Olimpiadas Wii Sports Domingueras"
          value={nombreMacroTorneo}
          onChange={(e) => onSetNombre(e.target.value)}
        />
      </div>

      <div className="grupo-campo">
        <label>Esquema de Brackets General:</label>
        <div className="selector-modos">
          <button
            type="button"
            className={`btn-selector ${tipoTorneo === 'brackets' ? 'activo' : ''}`}
            onClick={() => onSetTipo('brackets')}
          >
            🌿 Árbol de Eliminación
          </button>
          <button
            type="button"
            className={`btn-selector ${tipoTorneo === 'round_robin' ? 'activo' : ''}`}
            onClick={() => onSetTipo('round_robin')}
          >
            🔄 Todos vs Todos
          </button>
        </div>
      </div>

      <div className="grid-de-configuracion-previa">
        {/* JUGADORES */}
        <div className="bloque-pre-config">
          <h3>👥 Participantes ({jugadores.length})</h3>
          <form onSubmit={handleAgregarJugador} className="formulario-jugador">
            <div className="dropdown-emoji">
              <span className="btn-emoji-trigger">{nuevoEmoji}</span>
              <div className="grid-emojis">
                {LISTA_EMOJIS.map((e) => (
                  <span key={e} className="emoji-item" onClick={() => setNuevoEmoji(e)}>
                    {e}
                  </span>
                ))}
              </div>
            </div>
            <input
              type="text"
              placeholder="Nombre"
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
            />
            <button type="submit" className="btn-add">+</button>
          </form>
          <div className="tags-contenedor">
            {jugadores.map((j) => (
              <span key={j.id} className="tag-jugador">
                {j.emoji} {j.nombre}
                <span className="btn-borrar-tag" onClick={() => onEliminarJugador(j.id)}>×</span>
              </span>
            ))}
          </div>
        </div>

        {/* DEPORTES */}
        <div className="bloque-pre-config">
          <h3>🕹️ Deportes / Categorías ({deportes.length})</h3>
          <form onSubmit={handleAgregarDeporte} className="formulario-jugador">
            <input
              type="text"
              placeholder="Ej: Tenis, Golf, Boxeo..."
              value={nuevoDeporte}
              onChange={(e) => setNuevoDeporte(e.target.value)}
            />
            <button type="submit" className="btn-add" style={{ background: 'var(--cyan)' }}>+</button>
          </form>
          <div className="lista-deportes-planeados">
            {deportes.map((d, index) => (
              <div key={d.id} className="item-deporte-pila">
                <span>🏅 #{index + 1} - {d.nombre}</span>
                <span className="btn-borrar-deporte" onClick={() => onEliminarDeporte(d.id)}>×</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="acciones-pie" style={{ marginTop: '30px' }}>
        <button className="btn-link" type="button" onClick={onAtras}>Atrás</button>
        <button className="btn btn-success" type="button" onClick={onIniciar}>
          🚀 Iniciar Macro-Torneo
        </button>
      </div>
    </div>
  )
}