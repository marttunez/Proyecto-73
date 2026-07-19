import type { Effects } from './effects';
import type { GameState } from './types';

export interface Opcion {
  texto: string;
  requisito?: (s: GameState) => boolean;
  efectos: Effects;
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
