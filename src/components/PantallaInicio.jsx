export default function PantallaInicio({ onNuevo, onContinuar, tieneHistorial, deporteActual }) {
  return (
    <div className="hero">
      <h1>Macro-Torneos Preparados</h1>
      <p>
        Crea el evento principal, registra todos los deportes y tus
        jugadores una sola vez antes de empezar a competir.
      </p>
      <div className="grupo-botones-home">
        <button className="btn btn-primary" onClick={onNuevo}>
          Nuevo Torneo
        </button>
        {tieneHistorial && (
          <button className="btn btn-resume" onClick={onContinuar}>
            📊 Continuar {deporteActual ? `(${deporteActual})` : ''}
          </button>
        )}
      </div>
    </div>
  )
}