export interface Mazo<T> {
  disponibles: T[];
  descarte: T[];
}

function shuffle<T>(arr: T[]): T[] {
  const copia = [...arr];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

export function crearMazo<T>(cartas: T[]): Mazo<T> {
  return { disponibles: shuffle(cartas), descarte: [] };
}

export function robar<T>(mazo: Mazo<T>, cantidad: number): { mano: T[]; mazo: Mazo<T> } {
  let disponibles = [...mazo.disponibles];
  let descarte = [...mazo.descarte];

  if (disponibles.length < cantidad) {
    disponibles = [...disponibles, ...shuffle(descarte)];
    descarte = [];
  }

  return {
    mano: disponibles.slice(0, cantidad),
    mazo: { disponibles: disponibles.slice(cantidad), descarte },
  };
}

export function descartar<T>(mazo: Mazo<T>, cartas: T[]): Mazo<T> {
  return { disponibles: mazo.disponibles, descarte: [...mazo.descarte, ...cartas] };
}
