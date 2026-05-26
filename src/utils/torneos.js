export function mezclarArray(array) {
  let copia = [...array]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}

export function generarRoundRobin(jugadores) {
  let lista = [...jugadores]
  if (lista.length % 2 !== 0) {
    lista.push({ id: 'BYE', nombre: 'Descanso 🛌', emoji: '' })
  }
  const numJugadores = lista.length
  const rondasTotales = numJugadores - 1
  const partidosPorRonda = numJugadores / 2
  let partidos = []

  for (let r = 0; r < rondasTotales; r++) {
    for (let p = 0; p < partidosPorRonda; p++) {
      const local = lista[p]
      const visitante = lista[numJugadores - 1 - p]
      if (local.id !== 'BYE' && visitante.id !== 'BYE') {
        partidos.push({
          id: `rr-${r}-${p}`,
          ronda: r + 1,
          local,
          visitante,
          jugado: false,
          ganadorId: null,
        })
      }
    }
    lista.splice(1, 0, lista.pop())
  }
  return partidos
}

export function generarBrackets(jugadores) {
  let lista = mezclarArray(jugadores)
  const potencia2 = Math.pow(2, Math.ceil(Math.log2(lista.length)))
  let slots = [...lista]
  while (slots.length < potencia2) {
    slots.push({ id: 'BYE', nombre: 'Pase Automático', emoji: '⏩' })
  }
  let partidos = []
  let indexPartido = 0
  for (let i = 0; i < potencia2; i += 2) {
    const local = slots[i]
    const visitante = slots[i + 1]
    const esAutomatico = visitante.id === 'BYE'
    partidos.push({
      id: `b-1-${indexPartido}`,
      ronda: 1,
      local,
      visitante,
      jugado: esAutomatico,
      ganadorId: esAutomatico ? local.id : null,
    })
    indexPartido++
  }
  return { partidos, rondaActual: 1, totalRondas: Math.log2(potencia2) }
}