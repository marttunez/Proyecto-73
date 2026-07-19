import type { GameState } from './types';
import { type Effects, applyEffects } from './effects';
import { tensionSocial, tensionMilitar } from './derived';

// --- Coeficientes ajustables (tunea el balance jugando partidas) ---
const COEF_TENSION_SOCIAL_SOBRE_UP = 0.1; // puntos que pierde la UP por unidad de tensión social
const COEF_TENSION_MILITAR_SOBRE_OPOSICION = 0.05; // puntos que gana la oposición por unidad de tensión militar

type PesosOposicion = { dc: number; pn: number; dr: number };

function redistribuirProporcional(pesos: PesosOposicion, delta: number): PesosOposicion {
  const total = pesos.dc + pesos.pn + pesos.dr;
  if (total <= 0) {
    return { dc: delta / 3, pn: delta / 3, dr: delta / 3 };
  }
  return {
    dc: delta * (pesos.dc / total),
    pn: delta * (pesos.pn / total),
    dr: delta * (pesos.dr / total),
  };
}

function clampPolls(state: GameState): GameState {
  return {
    ...state,
    polls: {
      up: Math.max(0, state.polls.up),
      dc: Math.max(0, state.polls.dc),
      pn: Math.max(0, state.polls.pn),
      dr: Math.max(0, state.polls.dr),
    },
  };
}

// Regla 1: si la UP sube/baja por efecto directo de una carta o evento,
// los demás partidos se mueven en sentido contrario (cero-suma),
// repartido proporcional a su peso actual en encuestas.
function redistribuirCambioDirectoUP(state: GameState, deltaUP: number): GameState {
  if (deltaUP === 0) return state;
  const reparto = redistribuirProporcional(
    { dc: state.polls.dc, pn: state.polls.pn, dr: state.polls.dr },
    -deltaUP
  );
  return {
    ...state,
    polls: {
      ...state.polls,
      dc: state.polls.dc + reparto.dc,
      pn: state.polls.pn + reparto.pn,
      dr: state.polls.dr + reparto.dr,
    },
  };
}

// Regla 2: la tensión social castiga a la UP, beneficiando a la oposición.
function aplicarPenalizacionTensionSocial(state: GameState): GameState {
  const penalizacion = COEF_TENSION_SOCIAL_SOBRE_UP * tensionSocial(state);
  const reparto = redistribuirProporcional(
    { dc: state.polls.dc, pn: state.polls.pn, dr: state.polls.dr },
    penalizacion
  );
  return {
    ...state,
    polls: {
      up: state.polls.up - penalizacion,
      dc: state.polls.dc + reparto.dc,
      pn: state.polls.pn + reparto.pn,
      dr: state.polls.dr + reparto.dr,
    },
  };
}

// Regla 3: la tensión militar sube a toda la oposición a costa de la UP.
function aplicarBeneficioTensionMilitar(state: GameState): GameState {
  const beneficio = COEF_TENSION_MILITAR_SOBRE_OPOSICION * tensionMilitar(state);
  return {
    ...state,
    polls: {
      up: state.polls.up - beneficio,
      dc: state.polls.dc + beneficio / 3,
      pn: state.polls.pn + beneficio / 3,
      dr: state.polls.dr + beneficio / 3,
    },
  };
}

/**
 * Aplica los efectos de la carta/evento y luego encadena las 3 reglas de dinámica.
 * Reemplaza el uso directo de applyEffects en el reducer.
 */
export function aplicarEfectosConDinamica(prevGame: GameState, efectos: Effects): GameState {
  const conEfectosDirectos = applyEffects(prevGame, efectos);
  const deltaUP = conEfectosDirectos.polls.up - prevGame.polls.up;

  let resultado = redistribuirCambioDirectoUP(conEfectosDirectos, deltaUP);
  resultado = aplicarPenalizacionTensionSocial(resultado);
  resultado = aplicarBeneficioTensionMilitar(resultado);

  return clampPolls(resultado);
}
