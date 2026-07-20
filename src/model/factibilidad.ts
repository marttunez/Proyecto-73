import type { GameState } from './types';
import type { Opcion } from './contentTypes';

// Recursos "limitados": si llegan a 0, no se pueden tomar decisiones que los
// gasten aún más (efecto negativo sobre ese campo).
const RECURSOS_LIMITADOS: Array<'pais.presupuestoNacional' | 'partido.presupuestoPartido'> = [
  'pais.presupuestoNacional',
  'partido.presupuestoPartido',
];

/**
 * Una opción es factible si, para cada recurso limitado que intenta gastar
 * (delta negativo), el recurso actual es mayor a 0. Si el recurso ya está
 * en 0 (o menos), cualquier opción que lo reduzca aún más queda bloqueada.
 * Opciones que no tocan estos recursos, o que los aumentan, siempre son factibles.
 */
export function opcionEsFactible(opcion: Opcion, game: GameState): boolean {
  for (const recurso of RECURSOS_LIMITADOS) {
    const delta = opcion.efectos[recurso];
    if (delta === undefined || delta >= 0) continue; // no gasta este recurso

    const [grupo, campo] = recurso.split('.') as [keyof GameState, string];
    const valorActual = (game[grupo] as unknown as Record<string, number>)[campo];

    if (valorActual <= 0) return false;
  }
  return true;
}

/** Texto explicativo a mostrar cuando una opción está bloqueada por falta de recursos. */
export function motivoNoFactible(opcion: Opcion, game: GameState): string | null {
  if (opcionEsFactible(opcion, game)) return null;

  const faltantes: string[] = [];
  if ((opcion.efectos['pais.presupuestoNacional'] ?? 0) < 0 && game.pais.presupuestoNacional <= 0) {
    faltantes.push('presupuesto nacional');
  }
  if ((opcion.efectos['partido.presupuestoPartido'] ?? 0) < 0 && game.partido.presupuestoPartido <= 0) {
    faltantes.push('presupuesto del partido');
  }

  return `Sin ${faltantes.join(' ni ')} disponible.`;
}