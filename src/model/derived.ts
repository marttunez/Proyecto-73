import type { GameState } from './types';

export function tensionSocial(s: GameState): number {
  return s.pais.desempleo + 0.5 * s.pais.inflacion + 0.1 * s.polls.dc + 0.3 * s.polls.pn;
}

export function apoyoPopular(s: GameState): number {
  return s.polls.up - 0.2 * tensionSocial(s);
}

export function tensionMilitar(s: GameState): number {
  const promLealtad =
    (s.ffaa.lealtadEjercito + s.ffaa.lealtadArmada + s.ffaa.lealtadAerea + s.ffaa.lealtadCarabineros) / 4.0;
  const riesgoParamilitar = s.partido.militarizacionMIR + s.opp.militarizacionPyL;
  return 100.0 - 0.5 * riesgoParamilitar - 0.75 * promLealtad - 0.1 * apoyoPopular(s);
}

// Fuerza electoral combinada de la oposición
export function fuerzaOposicion(s: GameState): number {
  return s.polls.dc + s.polls.pn + s.polls.dr;
}

// Qué tan polarizado está el electorado (UP vs. resto)
export function polarizacion(s: GameState): number {
  return Math.abs(s.polls.up - fuerzaOposicion(s));
}

// Salud fiscal simple: presupuesto ponderado por inflación
export function saludFiscal(s: GameState): number {
  return s.pais.presupuestoNacional - 0.3 * s.pais.inflacion;
}

// Riesgo de fractura del partido (cohesión baja + tensión social alta = peligro)
export function riesgoFracturaPartido(s: GameState): number {
  return 100 - s.partido.cohesionPartidaria + 0.5 * tensionSocial(s);
}

// Riesgo paramilitar combinado (MIR + Patria y Libertad)
export function riesgoParamilitar(s: GameState): number {
  return s.partido.militarizacionMIR + s.opp.militarizacionPyL;
}

// Promedio de lealtad de las FFAA
export function lealtadPromedioFFAA(s: GameState): number {
  return (s.ffaa.lealtadEjercito + s.ffaa.lealtadArmada + s.ffaa.lealtadAerea + s.ffaa.lealtadCarabineros) / 4.0;
}

// Proyección electoral de cara a marzo de 1973
export function proyeccionElectoral(s: GameState): 'mayoria' | 'competitivo' | 'minoria' {
  if (s.polls.up >= 50) return 'mayoria';
  if (s.polls.up >= fuerzaOposicion(s) / 2) return 'competitivo';
  return 'minoria';
}
