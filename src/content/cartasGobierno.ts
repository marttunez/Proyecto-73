import type { Carta } from '../model/contentTypes';

export const cartasGobierno: Carta[] = [
  {
    id: 'control_precios',
    tipo: 'gobierno',
    titulo: 'Control de Precios',
    descripcion: 'La inflación golpea a las familias trabajadoras.',
    opciones: [
      {
        texto: 'Fijar precios por decreto',
        efectos: {
          'pais.inflacion': -1.2,
          'pais.presupuestoNacional': -1,
          'opp.relacionesPN': -1,
          'polls.up': 0.5,
        },
      },
      {
        texto: 'Dejar el mercado libre',
        efectos: {
          'pais.inflacion': 0.8,
          'polls.dc': 0.5,
          'pais.desempleo': -0.2,
        },
      },
    ],
  },
  {
    id: 'nacionalizacion_cobre',
    tipo: 'gobierno',
    titulo: 'Nacionalización del Cobre',
    descripcion: 'Se evalúa profundizar la nacionalización de la Gran Minería.',
    opciones: [
      {
        texto: 'Nacionalizar sin compensación',
        efectos: {
          'polls.up': 3,
          'ffaa.lealtadArmada': -1.5,
          'opp.relacionesPN': -1,
          'pais.presupuestoNacional': 1,
        },
      },
      {
        texto: 'Compensar a las empresas',
        efectos: {
          'pais.presupuestoNacional': -1,
          'opp.relacionesDC': 1,
          'ffaa.lealtadArmada': 0.5,
        },
      },
    ],
  },
  {
    id: 'gabinete_uti',
    tipo: 'gobierno',
    titulo: 'Reorganización de Gabinete',
    descripcion: 'Se evalúa incorporar generales a puestos clave del gabinete.',
    opciones: [
      {
        texto: 'Nombrar generales en el gabinete',
        efectos: {
          'ffaa.lealtadEjercito': 3,
          'ffaa.lealtadAerea': 2,
          'polls.up': -1,
          'partido.cohesionPartidaria': -1,
        },
      },
      {
        texto: 'Mantener gabinete civil',
        efectos: {
          'partido.cohesionPartidaria': 1,
          'ffaa.lealtadEjercito': -1,
        },
      },
    ],
  },
  {
    id: 'racionamiento',
    tipo: 'gobierno',
    titulo: 'Escasez y Racionamiento',
    descripcion: 'El desabastecimiento golpea a Santiago; se debate implementar racionamiento.',
    opciones: [
      {
        texto: 'Implementar Juntas de Abastecimiento (JAP)',
        efectos: {
          'polls.up': 1,
          'opp.relacionesDC': -2,
          'partido.militarizacionMIR': 1,
          'pais.desempleo': -0.2,
        },
      },
      {
        texto: 'Liberalizar la distribución',
        efectos: {
          'pais.inflacion': 0.5,
          'opp.relacionesDC': 1,
          'polls.dc': 0.5,
        },
      },
    ],
  },
];
