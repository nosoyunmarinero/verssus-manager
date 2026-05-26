import { useState, useEffect } from 'react'
import { generarBrackets, generarRoundRobin } from './utils/torneos'
import Header from './components/Header'
import Footer from './components/Footer'
import PantallaInicio from './components/PantallaInicio'
import PantallaConfig from './components/PantallaConfig'
import PantallaTorneo from './components/PantallaTorneo'
import { LISTA_EMOJIS } from './data/emojis'

export default function App() {
  const [pantalla, setPantalla] = useState('inicio')
  const [tipoTorneo, setTipoTorneo] = useState('brackets')
  const [nombreMacroTorneo, setNombreMacroTorneo] = useState('')
  const [jugadores, setJugadores] = useState([])
  const [deportes, setDeportes] = useState([])
  const [deporteIndexActual, setDeporteIndexActual] = useState(0)
  const [datosTorneo, setDatosTorneo] = useState(null)
  const [tieneHistorial, setTieneHistorial] = useState(false)

  useEffect(() => {
    const j = localStorage.getItem('macro_jugadores')
    const d = localStorage.getItem('macro_deportes')
    const n = localStorage.getItem('macro_nombre')
    const t = localStorage.getItem('macro_tipo_torneo')
    if (j) setJugadores(JSON.parse(j))
    if (d) setDeportes(JSON.parse(d))
    if (n) setNombreMacroTorneo(n)
    if (t) setTipoTorneo(t)
    const torneoActivo = localStorage.getItem('torneo_actual_datos')
    const indexActivo = localStorage.getItem('torneo_actual_index')
    if (torneoActivo && indexActivo) {
      setDatosTorneo(JSON.parse(torneoActivo))
      setDeporteIndexActual(parseInt(indexActivo))
      setTieneHistorial(true)
    }
  }, [])

  const guardarJugadores = (lista) => {
    setJugadores(lista)
    localStorage.setItem('macro_jugadores', JSON.stringify(lista))
  }

  const guardarDeportes = (lista) => {
    setDeportes(lista)
    localStorage.setItem('macro_deportes', JSON.stringify(lista))
  }

  const handleAgregarJugador = ({ nombre, emoji }) => {
    guardarJugadores([...jugadores, { id: Date.now().toString(), nombre, emoji }])
  }

  const handleAgregarDeporte = (nombre) => {
    guardarDeportes([...deportes, { id: Date.now().toString(), nombre }])
  }

  const iniciarMacroTorneo = () => {
    if (jugadores.length < 2) return alert('¡Necesitas al menos 2 jugadores!')
    if (deportes.length < 1) return alert('¡Añade al menos un deporte o categoría!')
    const titulo = nombreMacroTorneo.trim() || 'Torneo General Wii Sports'
    setNombreMacroTorneo(titulo)
    localStorage.setItem('macro_nombre', titulo)
    localStorage.setItem('macro_tipo_torneo', tipoTorneo)
    setDeporteIndexActual(0)
    const estructura = tipoTorneo === 'round_robin'
      ? { partidos: generarRoundRobin(jugadores) }
      : generarBrackets(jugadores)
    setDatosTorneo(estructura)
    localStorage.setItem('torneo_actual_datos', JSON.stringify(estructura))
    localStorage.setItem('torneo_actual_index', '0')
    setTieneHistorial(true)
    setPantalla('torneo')
  }

  const seleccionarGanador = (partidoId, ganadorId) => {
    const partido = datosTorneo.partidos.find((p) => p.id === partidoId)
    if (tipoTorneo === 'brackets' && partido.ronda < datosTorneo.rondaActual) {
      if (!confirm('Cambiar este resultado alterará las rondas siguientes. ¿Proceder?')) return
      const filtrados = datosTorneo.partidos.filter((p) => p.ronda <= partido.ronda)
      const actualizados = filtrados.map((p) =>
        p.id === partidoId
          ? { ...p, ganadorId: p.ganadorId === ganadorId ? null : ganadorId, jugado: p.ganadorId !== ganadorId }
          : p
      )
      const nuevoEstado = { ...datosTorneo, rondaActual: partido.ronda, partidos: actualizados }
      setDatosTorneo(nuevoEstado)
      localStorage.setItem('torneo_actual_datos', JSON.stringify(nuevoEstado))
      return
    }
    const actualizados = datosTorneo.partidos.map((p) => {
      if (p.id !== partidoId) return p
      const yaEra = p.ganadorId === ganadorId
      return { ...p, ganadorId: yaEra ? null : ganadorId, jugado: !yaEra }
    })
    const nuevoEstado = { ...datosTorneo, partidos: actualizados }
    setDatosTorneo(nuevoEstado)
    localStorage.setItem('torneo_actual_datos', JSON.stringify(nuevoEstado))
  }

  const avanzarRondaBrackets = () => {
    const partidosRonda = datosTorneo.partidos.filter((p) => p.ronda === datosTorneo.rondaActual)
    if (!partidosRonda.every((p) => p.jugado)) return alert('¡Termina todos los partidos de la ronda actual!')
    if (datosTorneo.rondaActual === datosTorneo.totalRondas) return
    const ganadores = partidosRonda.map((p) => p.ganadorId === p.local.id ? p.local : p.visitante)
    const proximaRonda = datosTorneo.rondaActual + 1
    let nuevosPartidos = [...datosTorneo.partidos]
    ganadores.forEach((j1, i) => {
      if (i % 2 !== 0) return
      const j2 = ganadores[i + 1] || null
      const esAuto = !j2 || j1.id === 'BYE' || j2?.id === 'BYE'
      nuevosPartidos.push({
        id: `b-${proximaRonda}-${Math.floor(i / 2)}`,
        ronda: proximaRonda,
        local: j1,
        visitante: j2 || { id: 'BYE', nombre: 'Pase Automático', emoji: '⏩' },
        jugado: esAuto,
        ganadorId: esAuto ? j1.id : null,
      })
    })
    const nuevoEstado = { ...datosTorneo, rondaActual: proximaRonda, partidos: nuevosPartidos }
    setDatosTorneo(nuevoEstado)
    localStorage.setItem('torneo_actual_datos', JSON.stringify(nuevoEstado))
  }

  const avanzarDeporte = () => {
    const proximoIndex = deporteIndexActual + 1
    if (proximoIndex >= deportes.length) return alert('🏆 ¡Has finalizado todos los deportes del evento!')
    if (!confirm(`¿Listo para pasar al siguiente deporte: "${deportes[proximoIndex].nombre}"?`)) return
    setDeporteIndexActual(proximoIndex)
    const estructura = tipoTorneo === 'round_robin'
      ? { partidos: generarRoundRobin(jugadores) }
      : generarBrackets(jugadores)
    setDatosTorneo(estructura)
    localStorage.setItem('torneo_actual_datos', JSON.stringify(estructura))
    localStorage.setItem('torneo_actual_index', proximoIndex.toString())
  }

  const reiniciarTodo = () => {
    if (!confirm('¿Borrar absolutamente todo (jugadores, deportes y progreso)?')) return
    localStorage.clear()
    setJugadores([]); setDeportes([]); setNombreMacroTorneo('')
    setDatosTorneo(null); setDeporteIndexActual(0); setTieneHistorial(false)
    setPantalla('inicio')
  }

  const obtenerCampeon = () => {
    if (!datosTorneo || datosTorneo.rondaActual !== datosTorneo.totalRondas) return null
    const final = datosTorneo.partidos?.find((p) => p.ronda === datosTorneo.totalRondas)
    if (final?.jugado) return final.ganadorId === final.local.id ? final.local : final.visitante
    return null
  }

  const campeon = obtenerCampeon()
  const deporteActualObjeto = deportes[deporteIndexActual]

  return (
    <div className="layout-contenedor">
      <Header mostrarReset={pantalla !== 'inicio'} onReset={reiniciarTodo} />
      <main className="main-contenido">
        {pantalla === 'inicio' && (
          <PantallaInicio
            onNuevo={() => setPantalla('config')}
            onContinuar={() => setPantalla('torneo')}
            tieneHistorial={tieneHistorial}
            deporteActual={deporteActualObjeto?.nombre}
          />
        )}
        {pantalla === 'config' && (
          <PantallaConfig
            jugadores={jugadores}
            deportes={deportes}
            tipoTorneo={tipoTorneo}
            nombreMacroTorneo={nombreMacroTorneo}
            onSetNombre={setNombreMacroTorneo}
            onSetTipo={setTipoTorneo}
            onAgregarJugador={handleAgregarJugador}
            onEliminarJugador={(id) => guardarJugadores(jugadores.filter((j) => j.id !== id))}
            onAgregarDeporte={handleAgregarDeporte}
            onEliminarDeporte={(id) => guardarDeportes(deportes.filter((d) => d.id !== id))}
            onIniciar={iniciarMacroTorneo}
            onAtras={() => setPantalla('inicio')}
          />
        )}
        {pantalla === 'torneo' && datosTorneo && deporteActualObjeto && (
          <PantallaTorneo
            nombreMacroTorneo={nombreMacroTorneo}
            deporteActual={deporteActualObjeto.nombre}
            deporteIndex={deporteIndexActual}
            totalDeportes={deportes.length}
            tipoTorneo={tipoTorneo}
            datosTorneo={datosTorneo}
            jugadores={jugadores}
            campeon={campeon}
            siguienteDeporte={deportes[deporteIndexActual + 1]?.nombre}
            onSeleccionarGanador={seleccionarGanador}
            onAvanzarRonda={avanzarRondaBrackets}
            onAvanzarDeporte={avanzarDeporte}
            onMenuPrincipal={() => setPantalla('inicio')}
          />
        )}
      </main>
      <Footer />
    </div>
  )
}