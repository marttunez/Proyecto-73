import type { Effects } from './effects';
import type { GameState } from './types';

/**
 * Lo que ocurre después de elegir una Opcion, dentro de la MISMA ventana del
 * evento/carta: el texto de la opcion se muestra separado del texto original,
 * y reemplaza los botones. Si trae 'siguientesOpciones', el evento continúa
 * con una nueva decisión anidada (mismo patrón, recursivamente); si no, el
 * evento queda listo para cerrarse con un botón "Continuar".
 */
export interface ResultadoOpcion {
  /**
   * Texto de la continuación. Puede ser fijo, o una función que recibe el
   * GameState YA ACTUALIZADO (después de aplicar los efectos de esta opción)
   * para dar un resultado distinto según los indicadores actuales.
   */
  texto: string | ((s: GameState) => string);
  /** Pregunta/prompt breve mostrado sobre las siguientesOpciones (opcional). */
  preguntaSiguiente?: string;
  /** Nueva decisión anidada dentro del mismo evento/carta, si corresponde. */
  siguientesOpciones?: Opcion[];
  /**
   * Si se define y evalúa true (con el GameState ya actualizado), la partida
   * termina INMEDIATAMENTE con un final anticipado (ej. golpe de Estado),
   * sin esperar al turno 12 ni a que se resuelvan más eventos pendientes.
   */
  finDeJuegoSi?: (s: GameState) => boolean;
  /** Mensaje mostrado en la pantalla de fin anticipado. Si se omite, se usa 'texto'. */
  mensajeFin?: string;
}

export interface Opcion {
  texto: string;
  requisito?: (s: GameState) => boolean;
  efectos: Effects;
  /**
   * Qué tan controversial/drástica es esta decisión, de 0 (moderada, de consenso)
   * a 10 (muy radical/polarizante). Si se omite, se asume INTENSIDAD_POR_DEFECTO
   * (ver pollDynamics.ts).
   */
  intensidad?: number;
  /** Continuación narrativa y/o decisión anidada tras elegir esta opción. */
  resultado?: ResultadoOpcion;
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