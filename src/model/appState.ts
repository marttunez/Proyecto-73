import { type GameState, initialState } from './types';
import type { Carta, Evento, Opcion, TipoCarta } from './contentTypes';
import { type Mazo, crearMazo, robar, descartar } from './mazo';
import { cartasPartido } from '../content/cartasPartido';
import { cartasGobierno } from '../content/cartasGobierno';
import { eventos as eventosData } from '../content/eventos';
import { aplicarEfectosConDinamica } from './pollDynamics';
import { generarNarrativa } from '../content/narrativas';
import {
  type AsientoPartido,
  type ResultadoElectoral,
  calcularParlamento,
  determinarResultado,
} from './parlamento';

export const ROBOS_MAX_POR_TURNO = 3;
export const LIMITE_MANO = 5; // máximo de cartas acumulables en mano a la vez
export const EVENTOS_MIN = 1;
export const EVENTOS_MAX = 2;
export const TOTAL_TURNOS = 12;

export type Fase = 'TURNO' | 'EVENTO' | 'FIN';

export interface AppState {
  game: GameState;
  fase: Fase;
  mazoPartido: Mazo<Carta>;
  mazoGobierno: Mazo<Carta>;
  mazoEventos: Mazo<Evento>;
  mano: Carta[]; // PERSISTENTE: se acumula turno a turno, solo se quita la carta jugada
  robosRestantes: number;
  cartaSeleccionada: Carta | null;
  eventosPendientes: Evento[]; // eventos de este turno aún no resueltos (aparecen minimizados)
  eventoSeleccionado: Evento | null; // evento "abierto" como diario
  eventoOpcionesActuales: Opcion[] | null; // opciones visibles ahora (top-level o anidadas). null = ya no hay más, mostrar "Continuar"
  eventoResultado: string | null; // texto de la última opción elegida, o null si aún no se elige ninguna
  eventoPregunta: string | null; // prompt breve mostrado sobre las opciones anidadas, si la hay
  narrativa: string; // texto de crónica del mes actual, mostrado en la parte superior
  resultadoFinal: {
    escanos: AsientoPartido[];
    resultado: ResultadoElectoral;
  } | null;
}

function iniciarTurno(state: AppState): AppState {
  return {
    ...state,
    // 'mano' NO se toca aquí a propósito, para que persista entre turnos
    robosRestantes: ROBOS_MAX_POR_TURNO,
    cartaSeleccionada: null,
    eventoSeleccionado: null,
    eventoOpcionesActuales: null,
    eventoResultado: null,
    eventoPregunta: null,
    narrativa: generarNarrativa(state.game.turno, state.game),
    fase: 'TURNO',
  };
}

export function crearAppStateInicial(): AppState {
  const base: AppState = {
    game: initialState,
    fase: 'TURNO',
    mazoPartido: crearMazo(cartasPartido),
    mazoGobierno: crearMazo(cartasGobierno),
    mazoEventos: crearMazo(eventosData),
    mano: [],
    robosRestantes: ROBOS_MAX_POR_TURNO,
    cartaSeleccionada: null,
    eventosPendientes: [],
    eventoSeleccionado: null,
    eventoOpcionesActuales: null,
    eventoResultado: null,
    eventoPregunta: null,
    narrativa: '',
    resultadoFinal: null,
  };
  return iniciarTurno(base);
}

export type AppAction =
  | { type: 'ROBAR_CARTA'; tipo: TipoCarta }
  | { type: 'SELECCIONAR_CARTA'; carta: Carta }
  | { type: 'JUGAR_OPCION'; opcion: Opcion }
  | { type: 'SELECCIONAR_EVENTO'; evento: Evento }
  | { type: 'ELEGIR_OPCION_EVENTO'; opcion: Opcion }
  | { type: 'CONTINUAR_EVENTO' }
  | { type: 'RESET' };

const TEXTO_RESULTADO_POR_DEFECTO = 'La decisión fue tomada. Sus efectos ya se dejan sentir en el país.';

function finalizarPartida(game: GameState): AppState['resultadoFinal'] {
  const escanos = calcularParlamento(game.polls);
  const escanosUP = escanos.find((e) => e.partido === 'up')?.escanos ?? 0;
  const resultado = determinarResultado(escanosUP);
  return { escanos, resultado };
}

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ROBAR_CARTA': {
      if (state.fase !== 'TURNO') return state;
      if (state.robosRestantes <= 0) return state;
      if (state.mano.length >= LIMITE_MANO) return state;

      if (action.tipo === 'partido') {
        const { mano, mazo } = robar(state.mazoPartido, 1);
        if (mano.length === 0) return state;
        return {
          ...state,
          mazoPartido: mazo,
          mano: [...state.mano, ...mano],
          robosRestantes: state.robosRestantes - 1,
        };
      } else {
        const { mano, mazo } = robar(state.mazoGobierno, 1);
        if (mano.length === 0) return state;
        return {
          ...state,
          mazoGobierno: mazo,
          mano: [...state.mano, ...mano],
          robosRestantes: state.robosRestantes - 1,
        };
      }
    }

    case 'SELECCIONAR_CARTA': {
      if (state.fase !== 'TURNO') return state;
      const yaSeleccionada = state.cartaSeleccionada?.id === action.carta.id;
      return { ...state, cartaSeleccionada: yaSeleccionada ? null : action.carta };
    }

    case 'JUGAR_OPCION': {
      if (state.fase !== 'TURNO' || !state.cartaSeleccionada) return state;

      const cartaJugada = state.cartaSeleccionada;
      const nuevoGame = aplicarEfectosConDinamica(state.game, action.opcion);

      const nuevaMano = state.mano.filter((c) => c.id !== cartaJugada.id);
      const mazoPartido =
        cartaJugada.tipo === 'partido' ? descartar(state.mazoPartido, [cartaJugada]) : state.mazoPartido;
      const mazoGobierno =
        cartaJugada.tipo === 'gobierno' ? descartar(state.mazoGobierno, [cartaJugada]) : state.mazoGobierno;

      const cantidadEventos = EVENTOS_MIN + Math.floor(Math.random() * (EVENTOS_MAX - EVENTOS_MIN + 1));
      const { mano: eventosPendientes, mazo: mazoEventos } = robar(state.mazoEventos, cantidadEventos);

      return {
        ...state,
        game: nuevoGame,
        mano: nuevaMano,
        mazoPartido,
        mazoGobierno,
        mazoEventos,
        cartaSeleccionada: null,
        eventoSeleccionado: null,
        eventoOpcionesActuales: null,
        eventoResultado: null,
        eventoPregunta: null,
        eventosPendientes,
        fase: eventosPendientes.length > 0 ? 'EVENTO' : 'TURNO',
      };
    }

    case 'SELECCIONAR_EVENTO': {
      if (state.fase !== 'EVENTO') return state;
      const yaSeleccionado = state.eventoSeleccionado?.id === action.evento.id;
      if (yaSeleccionado) {
        return {
          ...state,
          eventoSeleccionado: null,
          eventoOpcionesActuales: null,
          eventoResultado: null,
          eventoPregunta: null,
        };
      }
      return {
        ...state,
        eventoSeleccionado: action.evento,
        eventoOpcionesActuales: action.evento.opciones,
        eventoResultado: null,
        eventoPregunta: null,
      };
    }

    // Elige una opción DENTRO del evento abierto (top-level o anidada). NO cierra
    // el evento: aplica los efectos, calcula el texto de continuación (fijo o
    // dependiente del GameState resultante), y si la opción trae
    // 'siguientesOpciones', esas pasan a ser las nuevas opciones visibles.
    case 'ELEGIR_OPCION_EVENTO': {
      if (state.fase !== 'EVENTO' || !state.eventoSeleccionado || !state.eventoOpcionesActuales) return state;

      const nuevoGame = aplicarEfectosConDinamica(state.game, action.opcion);

      const resultado = action.opcion.resultado;
      const textoResultado = resultado
        ? typeof resultado.texto === 'function'
          ? resultado.texto(nuevoGame)
          : resultado.texto
        : TEXTO_RESULTADO_POR_DEFECTO;

      const siguientesOpciones =
        resultado?.siguientesOpciones && resultado.siguientesOpciones.length > 0
          ? resultado.siguientesOpciones
          : null;

      return {
        ...state,
        game: nuevoGame,
        eventoResultado: textoResultado,
        eventoOpcionesActuales: siguientesOpciones,
        eventoPregunta: siguientesOpciones ? resultado?.preguntaSiguiente ?? null : null,
      };
    }

    // Solo se puede invocar cuando ya no quedan más opciones dentro del evento
    // (eventoOpcionesActuales === null). Aquí recién se descarta el evento,
    // se revisan eventos restantes del turno, y se avanza turno si corresponde.
    case 'CONTINUAR_EVENTO': {
      if (state.fase !== 'EVENTO' || !state.eventoSeleccionado) return state;
      if (state.eventoOpcionesActuales) return state; // aún quedan decisiones por resolver

      const eventoResuelto = state.eventoSeleccionado;
      const restantes = state.eventosPendientes.filter((e) => e.id !== eventoResuelto.id);
      const mazoEventos = descartar(state.mazoEventos, [eventoResuelto]);

      if (restantes.length > 0) {
        return {
          ...state,
          eventosPendientes: restantes,
          eventoSeleccionado: null,
          eventoOpcionesActuales: null,
          eventoResultado: null,
          eventoPregunta: null,
          mazoEventos,
        };
      }

      const turnoSiguiente = state.game.turno + 1;
      const gameConTurno = { ...state.game, turno: turnoSiguiente };

      if (turnoSiguiente > TOTAL_TURNOS) {
        return {
          ...state,
          game: gameConTurno,
          mazoEventos,
          eventosPendientes: [],
          eventoSeleccionado: null,
          eventoOpcionesActuales: null,
          eventoResultado: null,
          eventoPregunta: null,
          fase: 'FIN',
          resultadoFinal: finalizarPartida(gameConTurno),
        };
      }

      return iniciarTurno({
        ...state,
        game: gameConTurno,
        mazoEventos,
        eventosPendientes: [],
      });
    }

    case 'RESET':
      return crearAppStateInicial();

    default:
      return state;
  }
}