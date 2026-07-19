import type { GameState } from './types';
import { applyEffects } from './effects';
import { tensionSocial, tensionMilitar } from './derived';
import type { Opcion } from './contentTypes';

// --- Coeficientes ajustables (tunea el balance jugando partidas) ---
const COEF_TENSION_SOCIAL_SOBRE_UP = 0.1; // puntos que pierde la UP por unidad de tensión social, a intensidad máxima
const COEF_TENSION_MILITAR_SOBRE_OPOSICION = 0.05; // puntos que gana la oposición por unidad de tensión militar, a intensidad máxima

// Si una carta/evento no especifica 'intensidad', se asume esta por defecto.
// La dejamos baja para no castigar contenido viejo que no la tenga tageada.
const INTENSIDAD_POR_DEFECTO = 2;

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
// Esta regla SIEMPRE corre completa: es el reflejo directo de lo que la
// carta ya declaró explícitamente, no un desgaste ambiental extra.
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
// AHORA escalada por 'factor' (0..1) según qué tan controversial fue la decisión.
function aplicarPenalizacionTensionSocial(state: GameState, factor: number): GameState {
  if (factor <= 0) return state;
  const penalizacion = factor * COEF_TENSION_SOCIAL_SOBRE_UP * tensionSocial(state);
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
// AHORA escalada por 'factor' (0..1) según qué tan controversial fue la decisión.
function aplicarBeneficioTensionMilitar(state: GameState, factor: number): GameState {
  if (factor <= 0) return state;
  const beneficio = factor * COEF_TENSION_MILITAR_SOBRE_OPOSICION * tensionMilitar(state);
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
 * Aplica los efectos de la opción elegida y luego encadena las 3 reglas de dinámica.
 * Las reglas ambientales (2 y 3) ahora se escalan por la 'intensidad' de la opción:
 * decisiones moderadas (intensidad baja) casi no generan desgaste hacia la
 * oposición; decisiones muy controversiales (intensidad alta) sí lo hacen, con
 * fuerza completa.
 */
export function aplicarEfectosConDinamica(prevGame: GameState, opcion: Opcion): GameState {
  const conEfectosDirectos = applyEffects(prevGame, opcion.efectos);
  const deltaUP = conEfectosDirectos.polls.up - prevGame.polls.up;

  let resultado = redistribuirCambioDirectoUP(conEfectosDirectos, deltaUP);

  const intensidad = opcion.intensidad ?? INTENSIDAD_POR_DEFECTO;
  const factor = Math.max(0, Math.min(1, intensidad / 10));

  resultado = aplicarPenalizacionTensionSocial(resultado, factor);
  resultado = aplicarBeneficioTensionMilitar(resultado, factor);

  return clampPolls(resultado);
}
