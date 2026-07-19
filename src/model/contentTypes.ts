import type { Effects } from './effects';
import type { GameState } from './types';


/**
 * Creamos una interfaz para poder tener la opción de continuidad en los eventos
 */
export interface ResultadoOpcion {
  preguntaSiguiente: string | null;
  siguientesOpciones: any;
  texto: string | ((s: GameState) => string);
  pregunta?: string;
  opciones?: Opcion[];
}

export interface Opcion {
  texto: string;
  requisito?: (s: GameState) => boolean;
  efectos: Effects;
  intensidad?: number;

  resultado: ResultadoOpcion | null | undefined;

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
