import type { Carta } from '../model/contentTypes';

export const cartasPartido: Carta[] = [
  {
    id: 'reforma_agraria',
    tipo: 'partido',
    titulo: 'Aceleración de la Reforma Agraria',
    descripcion: 'El MIR presiona por tomas de terreno en el campo.',
    opciones: [
      {
        texto: 'Expropiar sin indemnización',
        efectos: {
          'polls.up': 2.0,
          'opp.relacionesDC': -1,
          'opp.relacionesPN': -2,
          'ffaa.lealtadEjercito': -1.5,
          'pais.inflacion': 0.3,
          'partido.registradosMIR': 1500,
        },
      },
      {
        texto: 'Negociar con la DC',
        efectos: {
          'polls.dc': 1,
          'partido.cohesionPartidaria': -3,
          'partido.militarizacionMIR': 1,
          'pais.presupuestoNacional': -1,
        },
      },
    ],
  },
  {
    id: 'congreso_partido',
    tipo: 'partido',
    titulo: 'Congreso Interno del Partido',
    descripcion: 'Tensiones entre sectores moderados y radicales de la coalición.',
    opciones: [
      {
        texto: 'Favorecer ala moderada',
        efectos: {
          'partido.cohesionPartidaria': 4,
          'partido.militarizacionMIR': -1,
          'opp.relacionesDC': 1,
          'polls.up': -0.5,
        },
      },
      {
        texto: 'Favorecer ala radical',
        efectos: {
          'partido.militarizacionMIR': 2,
          'partido.registradosMIR': 2000,
          'polls.up': 1,
          'ffaa.lealtadEjercito': -1,
        },
      },
    ],
  },
  {
    id: 'cordones_industriales',
    tipo: 'partido',
    titulo: 'Cordones Industriales',
    descripcion: 'Obreros organizan cordones de control de fábricas en Santiago.',
    opciones: [
      {
        texto: 'Apoyar y armar los cordones',
        efectos: {
          'polls.up': 1.5,
          'partido.militarizacionMIR': 2,
          'ffaa.lealtadEjercito': -2,
          'opp.militarizacionPyL': 1,
        },
      },
      {
        texto: 'Contener e institucionalizar',
        efectos: {
          'partido.cohesionPartidaria': -2,
          'pais.desempleo': -0.3,
          'partido.presupuestoPartido': -1,
        },
      },
    ],
  },
  {
    id: 'propaganda_partido',
    tipo: 'partido',
    titulo: 'Campaña de Propaganda',
    descripcion: 'El partido decide cómo invertir sus recursos comunicacionales.',
    opciones: [
      {
        texto: 'Movilización de base puerta a puerta',
        efectos: {
          'partido.presupuestoPartido': -1,
          'polls.up': 2,
          'partido.cohesionPartidaria': 1,
        },
      },
      {
        texto: 'Guardar recursos para el mes de la elección',
        efectos: {
          'partido.presupuestoPartido': 1,
          'polls.up': -0.5,
        },
      },
    ],
  },
];
