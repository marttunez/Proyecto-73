import type { Effects } from './effects';
import type { GameState } from './types';

export interface Opcion {
  texto: string;
  requisito?: (s: GameState) => boolean;
  efectos: Effects;
  /**
   * Qué tan controversial/drástica es esta decisión, de 0 (moderada, de consenso)
   * a 10 (muy radical/polarizante). Si se omite, se asume INTENSIDAD_POR_DEFECTO
   * (ver pollDynamics.ts). Este valor escala cuánto empuja la decisión el
   * desgaste ambiental de encuestas hacia la oposición.
   */
  intensidad?: number;
}

export type TipoCarta = 'partido' | 'gobierno';

export interface Carta {
  id: string;
  tipo: TipoCarta;
  titulo: string;
  descripcion: string;
  opciones: Opcion[];
}

export interface Evento {
  id: string;
  titulo: string;
  descripcion: string;
  opciones: Opcion[];
}
