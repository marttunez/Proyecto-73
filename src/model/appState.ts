import { type GameState, initialState } from './types';
import type { Carta, Evento, Opcion, TipoCarta } from './contentTypes';
import { type Mazo, crearMazo, robar, descartar } from './mazo';
import { cartasPartido } from '../content/cartasPartido';
import { cartasGobierno } from '../content/cartasGobierno';
import { eventos as eventosData } from '../content/eventos';
import { aplicarEfectosConDinamica } from './pollDynamics';
import {
  type AsientoPartido,
  type ResultadoElectoral,
  calcularParlamento,
  determinarResultado,
} from './parlamento';

export const ROBOS_MAX_POR_TURNO = 2;
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
  robosRestantes: number; // se reinicia a ROBOS_MAX_POR_TURNO cada turno
  cartaSeleccionada: Carta | null; // carta "abierta" como diario, mostrando sus opciones
  eventosPendientes: Evento[]; // eventos de este turno aún no resueltos (aparecen minimizados)
  eventoSeleccionado: Evento | null; // evento "abierto" como diario, mostrando sus opciones
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
    resultadoFinal: null,
  };
  return iniciarTurno(base);
}

export type AppAction =
  | { type: 'ROBAR_CARTA'; tipo: TipoCarta }
  | { type: 'SELECCIONAR_CARTA'; carta: Carta }
  | { type: 'JUGAR_OPCION'; opcion: Opcion }
  | { type: 'SELECCIONAR_EVENTO'; evento: Evento }
  | { type: 'JUGAR_EVENTO'; opcion: Opcion }
  | { type: 'RESET' };

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

      // Solo se descarta la carta JUGADA. Las demás cartas en mano persisten para el próximo turno.
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
        eventosPendientes,
        fase: eventosPendientes.length > 0 ? 'EVENTO' : 'TURNO',
      };
    }

    case 'SELECCIONAR_EVENTO': {
      if (state.fase !== 'EVENTO') return state;
      const yaSeleccionado = state.eventoSeleccionado?.id === action.evento.id;
      return { ...state, eventoSeleccionado: yaSeleccionado ? null : action.evento };
    }

    case 'JUGAR_EVENTO': {
      if (state.fase !== 'EVENTO' || !state.eventoSeleccionado) return state;

      const eventoResuelto = state.eventoSeleccionado;
      const nuevoGame = aplicarEfectosConDinamica(state.game, action.opcion);
      const restantes = state.eventosPendientes.filter((e) => e.id !== eventoResuelto.id);
      const mazoEventos = descartar(state.mazoEventos, [eventoResuelto]);

      // Aún quedan eventos de este turno por resolver: vuelven a aparecer
      // minimizados (el jugador elige cuál abrir a continuación).
      if (restantes.length > 0) {
        return {
          ...state,
          game: nuevoGame,
          eventosPendientes: restantes,
          eventoSeleccionado: null,
          mazoEventos,
        };
      }

      const turnoSiguiente = nuevoGame.turno + 1;
      const gameConTurno = { ...nuevoGame, turno: turnoSiguiente };

      if (turnoSiguiente > TOTAL_TURNOS) {
        return {
          ...state,
          game: gameConTurno,
          mazoEventos,
          eventosPendientes: [],
          eventoSeleccionado: null,
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