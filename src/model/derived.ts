import type { GameState } from './types';

export function tensionSocial(s: GameState): number {
  return s.pais.desempleo + 0.5 * s.pais.inflacion + 0.1 * s.polls.dc + 0.3 * s.polls.pn;
}

export function apoyoPopular(s: GameState): number {
  return s.polls.up - 0.2 * tensionSocial(s);
}

export function tensionMilitar(s: GameState, prevState?: GameState): number {
  const promLealtadActual =
    (s.ffaa.lealtadEjercito + s.ffaa.lealtadArmada + s.ffaa.lealtadAerea + s.ffaa.lealtadCarabineros) / 4.0;
    
  const riesgoParamilitar = s.partido.militarizacionMIR + s.opp.militarizacionPyL;
  
  // 1. Calculamos la tensión base
  let tension = 100.0 - 0.5 * riesgoParamilitar - 0.85 * promLealtadActual - 0.1 * apoyoPopular(s);

  // 2. Si tenemos el estado anterior, aplicamos el impacto de la variación
  if (prevState) {
    const promLealtadAnterior =
      (prevState.ffaa.lealtadEjercito + prevState.ffaa.lealtadArmada + prevState.ffaa.lealtadAerea + prevState.ffaa.lealtadCarabineros) / 4.0;
      
    // Si la lealtad bajó, la variación será negativa (ej. 45 - 50 = -5)
    const variacionLealtad = promLealtadActual - promLealtadAnterior;
    
    // Multiplicamos por -0.5: un cambio de -5 sumará +2.5 a la tensión
    tension -= variacionLealtad * 5.5; 
  }

  return tension;
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
