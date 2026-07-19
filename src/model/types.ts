export interface Partido {
  cohesionPartidaria: number;
  presupuestoPartido: number;
  registradosMIR: number;
  militarizacionMIR: number;
}

export interface Pais {
  presupuestoNacional: number;
  inflacion: number;
  desempleo: number;
}

export interface FFAA {
  lealtadEjercito: number;
  lealtadArmada: number;
  lealtadAerea: number;
  lealtadCarabineros: number;
}

export interface Oposicion {
  relacionesDC: number;
  relacionesPN: number;
  relacionesDR: number;
  registradosPyL: number;
  militarizacionPyL: number;
}

export interface Polls {
  up: number;
  dc: number;
  pn: number;
  dr: number;
}

export interface GameState {
  turno: number; // 1..12
  partido: Partido;
  pais: Pais;
  ffaa: FFAA;
  opp: Oposicion;
  polls: Polls;
}

export const initialState: GameState = {
  turno: 1,
  partido: {
    cohesionPartidaria: 70.5,
    presupuestoPartido: 3,
    registradosMIR: 30000,
    militarizacionMIR: 3,
  },
  pais: {
    presupuestoNacional: 4,
    inflacion: 5.5,
    desempleo: 4.4,
  },
  ffaa: {
    lealtadEjercito: 65.5,
    lealtadArmada: 35.3,
    lealtadAerea: 55.5,
    lealtadCarabineros: 70.5,
  },
  opp: {
    relacionesDC: 3,
    relacionesPN: 1,
    relacionesDR: 2,
    registradosPyL: 10000,
    militarizacionPyL: 2,
  },
  polls: {
    up: 39.9,
    dc: 22.5,
    pn: 19.5,
    dr: 4.0,
  },
};
