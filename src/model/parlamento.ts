import type { Polls } from './types';

export const TOTAL_ESCANOS = 120;
export const ESCANOS_PARA_VICTORIA = 61;
export const ESCANOS_PARA_DERROTA = 59;

export type ClavePartido = 'up' | 'dc' | 'pn' | 'dr';

export interface AsientoPartido {
  partido: ClavePartido;
  porcentaje: number;
  escanos: number;
}

/**
 * Reparte 120 escaños proporcionalmente a las encuestas finales,
 * usando el método de restos mayores (Hamilton) para que la suma
 * siempre cuadre exactamente en TOTAL_ESCANOS.
 */
export function calcularParlamento(polls: Polls): AsientoPartido[] {
  const total = polls.up + polls.dc + polls.pn + polls.dr;
  const partidos: ClavePartido[] = ['up', 'dc', 'pn', 'dr'];
  const valores = { up: polls.up, dc: polls.dc, pn: polls.pn, dr: polls.dr };

  const escanosBrutos = partidos.map((p) => (total > 0 ? (valores[p] / total) * TOTAL_ESCANOS : 0));
  const escanosBase = escanosBrutos.map(Math.floor);
  const asignados = escanosBase.reduce((a, b) => a + b, 0);
  const faltantes = TOTAL_ESCANOS - asignados;

  const restos = escanosBrutos
    .map((valor, i) => ({ i, resto: valor - escanosBase[i] }))
    .sort((a, b) => b.resto - a.resto);

  const escanosFinal = [...escanosBase];
  for (let k = 0; k < faltantes; k++) {
    escanosFinal[restos[k].i] += 1;
  }

  return partidos.map((p, i) => ({
    partido: p,
    porcentaje: total > 0 ? (valores[p] / total) * 100 : 0,
    escanos: escanosFinal[i],
  }));
}

export type ResultadoElectoral = 'victoria' | 'empate' | 'derrota';

export function determinarResultado(escanosUP: number): ResultadoElectoral {
  if (escanosUP >= ESCANOS_PARA_VICTORIA) return 'victoria';
  if (escanosUP <= ESCANOS_PARA_DERROTA) return 'derrota';
  return 'empate'; // exactamente 60 escaños
}
