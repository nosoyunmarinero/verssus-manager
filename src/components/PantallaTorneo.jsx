import BracketView from './BracketView'
import RoundRobinView from './RoundRobinView'

export default function PantallaTorneo({
  nombreMacroTorneo, deporteActual, deporteIndex, totalDeportes,
  tipoTorneo, datosTorneo, jugadores,
  campeon, siguienteDeporte,
  onSeleccionarGanador, onAvanzarRonda, onAvanzarDeporte, onMenuPrincipal,
}) {
  return (
    <div className="ancho-completo-centrado">
      <div className="cabecera-torneo">
        <button className="btn-link" onClick={onMenuPrincipal} style={{ marginBottom: '15px', display: 'inline-block' }}>
          🏠 Menu Principal
        </button>
        <p className="subtitulo-macro">{nombreMacroTorneo}</p>
        <h2>Deporte: {deporteActual} 🏆</h2>
        <div className="pildora-progreso-deportes">
          Categoría {deporteIndex + 1} de {totalDeportes}
        </div>
      </div>

      {campeon && (
        <div className="tarjeta-campeon">
          <h2>👑 ¡Ganador de la Medalla de Oro! 👑</h2>
          <p>{campeon.emoji} {campeon.nombre}</p>
          {siguienteDeporte && (
            <button className="btn btn-success" onClick={onAvanzarDeporte} style={{ marginTop: '20px' }}>
              ⚔️ Ir a: {siguienteDeporte}
            </button>
          )}
        </div>
      )}

      {tipoTorneo === 'brackets' ? (
        <BracketView
          datosTorneo={datosTorneo}
          onSeleccionarGanador={onSeleccionarGanador}
          onAvanzarRonda={onAvanzarRonda}
          campeon={campeon}
        />
      ) : (
        <RoundRobinView
          datosTorneo={datosTorneo}
          jugadores={jugadores}
          onSeleccionarGanador={onSeleccionarGanador}
        />
      )}
    </div>
  )
}