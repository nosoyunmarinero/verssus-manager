export default function BracketView({ datosTorneo, onSeleccionarGanador, onAvanzarRonda, campeon }) {
  const arrayRondas = Array.from({ length: datosTorneo.totalRondas || 0 }, (_, i) => i + 1)

  return (
    <div className="contenedor-arbol-brackets-dinamico">
      <div className="brackets-controles">
        <p>📌 Presiona sobre el jugador para promoverlo en el árbol gráfico.</p>
        {!campeon && (
          <button className="btn btn-primary" onClick={onAvanzarRonda}>
            ⏩ Procesar Siguiente Ronda
          </button>
        )}
      </div>
      <div className="area-grafica-bracket">
        {arrayRondas.map((rondaNum) => (
          <div key={rondaNum} className="columna-ronda-grafica">
            <div className="titulo-cabecera-ronda">
              {rondaNum === datosTorneo.totalRondas ? '🏅 Gran Final' : `Ronda ${rondaNum}`}
            </div>
            <div className="grupo-celdas-ronda">
              {datosTorneo.partidos
                .filter((p) => p.ronda === rondaNum)
                .map((partido) => {
                  const esBye = partido.local.id === 'BYE' || partido.visitante.id === 'BYE'
                  return (
                    <div key={partido.id} className="match-nodo-arbol">
                      <div className="caja-enfrentamiento-arbol">
                        {[partido.local, partido.visitante].map((jugador) => {
                          const esGanador = partido.ganadorId === jugador.id
                          const esPerdedor = partido.ganadorId && !esGanador
                          return (
                            <div
                              key={jugador.id}
                              className={`slot-jugador ${esGanador ? 'ganador' : ''} ${esPerdedor ? 'perdedor' : ''} ${esBye ? 'deshabilitado' : ''}`}
                              onClick={() => !esBye && onSeleccionarGanador(partido.id, jugador.id)}
                            >
                              <span className="cortar-texto">{jugador.emoji} {jugador.nombre}</span>
                              {esGanador && <span className="check">✓</span>}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}