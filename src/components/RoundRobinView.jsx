export default function RoundRobinView({ datosTorneo, jugadores, onSeleccionarGanador }) {
  const calcularTabla = () => {
    let tabla = {}
    jugadores.forEach((j) => {
      tabla[j.id] = { ...j, pj: 0, pg: 0, pp: 0, pts: 0 }
    })
    datosTorneo?.partidos?.forEach((p) => {
      if (!p.jugado || !tabla[p.local.id] || !tabla[p.visitante.id]) return
      tabla[p.local.id].pj++
      tabla[p.visitante.id].pj++
      if (p.ganadorId === p.local.id) {
        tabla[p.local.id].pg++
        tabla[p.local.id].pts += 3
        tabla[p.visitante.id].pp++
      } else if (p.ganadorId === p.visitante.id) {
        tabla[p.visitante.id].pg++
        tabla[p.visitante.id].pts += 3
        tabla[p.local.id].pp++
      }
    })
    return Object.values(tabla).sort((a, b) => b.pts - a.pts || b.pg - a.pg)
  }

  return (
    <div className="grid-dos-columnas">
      <div className="columna-calendario">
        <h3 className="titulo-seccion">📅 Enfrentamientos Directos</h3>
        <div className="lista-partidos-rr">
          {datosTorneo.partidos?.map((partido) => {
            const esBye = partido.local.id === 'BYE' || partido.visitante.id === 'BYE'
            return (
              <div key={partido.id} className="caja-enfrentamiento-rr">
                <div className="tag-ronda-partido">Ronda {partido.ronda}</div>
                {[
                  { jugador: partido.local, id: partido.local.id },
                  { jugador: partido.visitante, id: partido.visitante.id },
                ].map(({ jugador, id }, idx) => (
                  <div key={id}>
                    {idx === 1 && <div className="vs-rr">vs</div>}
                    <div
                      className="fila-jugador-rr"
                      onClick={() => !esBye && onSeleccionarGanador(partido.id, id)}
                    >
                      <span className={`cortar-texto ${partido.ganadorId === id ? 'ganador-texto' : ''}`}>
                        {jugador.emoji} {jugador.nombre}
                      </span>
                      {partido.ganadorId === id && '🏅'}
                    </div>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>

      <div className="columna-tabla">
        <h3 className="titulo-seccion">📊 Puntuación</h3>
        <div className="tarjeta-tabla">
          <table className="tabla-gaming">
            <thead>
              <tr>
                <th>Pos</th>
                <th className="izq">Jugador</th>
                <th>PJ</th>
                <th>G</th>
                <th>Pts</th>
              </tr>
            </thead>
            <tbody>
              {calcularTabla().map((jug, idx) => (
                <tr key={jug.id} className={idx === 0 ? 'lider-tabla' : ''}>
                  <td>#{idx + 1}</td>
                  <td className="izq">{jug.emoji} {jug.nombre}</td>
                  <td>{jug.pj}</td>
                  <td>{jug.pg}</td>
                  <td><span className="pildora-puntos">{jug.pts}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}