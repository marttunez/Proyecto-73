import { type GameState, initialState } from './types';
import type { Carta, Evento, Opcion, TipoCarta } from './contentTypes';
import { type Mazo, crearMazo, robar, descartar } from './mazo';
import { cartasPartido } from '../content/cartasPartido';
import { cartasGobierno } from '../content/cartasGobierno';
import { eventos as eventosData } from '../content/eventos';
import { aplicarEfectosConDinamica } from './pollDynamics';

export const ROBOS_MAX_POR_TURNO = 2;
export const EVENTOS_MIN = 1;
export const EVENTOS_MAX = 2;
export const TOTAL_TURNOS = 12;

export type Fase = 'TURNO' | 'EVENTO' | 'FIN';

export interface AppState {
  mano: Carta[];
  resultadoFinal: boolean;
  game: GameState;
  fase: Fase;
  mazoPartido: Mazo<Carta>;
  mazoGobierno: Mazo<Carta>;
  mazoEventos: Mazo<Evento>;
  manoActual: Carta[]; // cartas ya robadas este turno, sin jugar aún
  robosRestantes: number; // cuántos robos le quedan este turno (max 2)
  cartaSeleccionada: Carta | null; // carta cuyas opciones se están mostrando
  eventosPendientes: Evento[];
}

function iniciarTurno(state: AppState): AppState {
  return {
    ...state,
    manoActual: [],
    robosRestantes: ROBOS_MAX_POR_TURNO,
    cartaSeleccionada: null,
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
    manoActual: [],
    robosRestantes: ROBOS_MAX_POR_TURNO,
    cartaSeleccionada: null,
    eventosPendientes: [],
    mano: [],
    resultadoFinal: false
  };
  return iniciarTurno(base);
}

export type AppAction =
  | { type: 'ROBAR_CARTA'; tipo: TipoCarta }
  | { type: 'SELECCIONAR_CARTA'; carta: Carta }
  | { type: 'JUGAR_OPCION'; opcion: Opcion }
  | { type: 'JUGAR_EVENTO'; opcion: Opcion }
  | { type: 'RESET' };

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
          manoActual: [...state.manoActual, ...mano],
          robosRestantes: state.robosRestantes - 1,
        };
      } else {
        const { mano, mazo } = robar(state.mazoGobierno, 1);
        if (mano.length === 0) return state;
        return {
          ...state,
          mazoGobierno: mazo,
          manoActual: [...state.manoActual, ...mano],
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

      const nuevoGame = aplicarEfectosConDinamica(state.game, action.opcion.efectos);

      const partidoRobadas = state.manoActual.filter((c) => c.tipo === 'partido');
      const gobiernoRobadas = state.manoActual.filter((c) => c.tipo === 'gobierno');
      const mazoPartido = descartar(state.mazoPartido, partidoRobadas);
      const mazoGobierno = descartar(state.mazoGobierno, gobiernoRobadas);

      const cantidadEventos = EVENTOS_MIN + Math.floor(Math.random() * (EVENTOS_MAX - EVENTOS_MIN + 1));
      const { mano: eventosPendientes, mazo: mazoEventos } = robar(state.mazoEventos, cantidadEventos);

      return {
        ...state,
        game: nuevoGame,
        mazoPartido,
        mazoGobierno,
        mazoEventos,
        manoActual: [],
        robosRestantes: 0,
        cartaSeleccionada: null,
        eventosPendientes,
        fase: eventosPendientes.length > 0 ? 'EVENTO' : 'TURNO',
      };
    }

    case 'JUGAR_EVENTO': {
      if (state.fase !== 'EVENTO') return state;

      const nuevoGame = aplicarEfectosConDinamica(state.game, action.opcion.efectos);
      const [resuelto, ...restantes] = state.eventosPendientes;
      const mazoEventos = descartar(state.mazoEventos, [resuelto]);

      if (restantes.length > 0) {
        return { ...state, game: nuevoGame, eventosPendientes: restantes, mazoEventos };
      }

      const turnoSiguiente = nuevoGame.turno + 1;
      const gameConTurno = { ...nuevoGame, turno: turnoSiguiente };

      if (turnoSiguiente > TOTAL_TURNOS) {
        return { ...state, game: gameConTurno, mazoEventos, eventosPendientes: [], fase: 'FIN' };
      }

      return iniciarTurno({ ...state, game: gameConTurno, mazoEventos, eventosPendientes: [] });
    }

    case 'RESET':
      return crearAppStateInicial();

    default:
      return state;
  }
}
