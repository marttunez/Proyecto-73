import type { Carta } from '../model/contentTypes';

export const cartasGobierno: Carta[] = [
  {
    id: 'indultar_miristas',
    tipo: 'gobierno',
    titulo: 'Indultos a Miristas',
    descripcion: 'Hasta las oficinas del Presidente de la República han llegado las peticiones de indulto a miembros del Movimiento de Izquierda Revolucionario, condenados por el asesinato de Edmundo Pérez Zujovic en 1971. Los sectores radicales del gobierno presionan al presidente para que firme mientras que sus asesores moderados le recomiendan no entregarle a la derecha un motivo para acusarlo de debilidad frente a la violencia política.',
    opciones: [
      {
        texto: 'Firmar el indulto a los miristas',
        intensidad: 4,
        efectos: {
          'partido.cohesionPartidaria': 5,
          'polls.up': -1.5,
          'opp.relacionesDC': -1,
          'opp.relacionesPN': -1,
          'ffaa.lealtadAerea': -2,
          'ffaa.lealtadArmada': -3,
          'ffaa.lealtadEjercito': -5,
          'ffaa.lealtadCarabineros': -5,
          'partido.militarizacionMIR': 1,
          'opp.militarizacionPyL': 1,
        },
      },
      {
        texto: 'Denegar los indultos y mantenerse a margen de la violencia política',
        intensidad: 2,
        efectos: {
          'partido.cohesionPartidaria': -5,
          'partido.militarizacionMIR': 1,
          'polls.up': 1.5,
          'ffaa.lealtadCarabineros': 10,
        },
      },
    ],
  },
  {
    id: 'control_precios',
    tipo: 'gobierno',
    titulo: 'Control de Precios',
    descripcion: 'La inflación golpea a las familias trabajadoras, millones de chilenos ven como los precios de los alimentos suben y suben. El gobierno se ve obligado a tomar medidas para apalear la inflación.',
    opciones: [
      {
        texto: 'Fijar precios de alimentos de primera necesidad vía decreto',
        intensidad: 4,
        efectos: {
          'pais.inflacion': 5.5,
          'pais.presupuestoNacional': -1,
          'opp.relacionesPN': -1,
          'polls.up': 1,
          'ffaa.lealtadEjercito': 5,
        },
      },
      {
        texto: 'No hay nada que podamos hacer, la inflación es un fenómeno global',
        intensidad: 2,
        efectos: {
          'pais.inflacion': -1.5,
          'polls.dc': 0.5,
          'pais.desempleo': 1.5,
          'partido.cohesionPartidaria': -5,
        },
      },
    ],
  },
  {
    id: 'nacionalizacion_cobre',
    tipo: 'gobierno',
    titulo: 'Nacionalización del Cobre',
    descripcion: 'Salvador Allende llegó a La Moneda con un programa de nacionalización del cobre, ahora el presidente debe decidir si nacionaliza las minas sin compensación a las empresas extranjeras o si negocia un acuerdo de compensación con ellas.',
    opciones: [
      {
        texto: 'Nacionalizar sin compensación',
        intensidad: 7, // choca directo con EE.UU. y la Armada
        efectos: {
          'polls.up': 5,
          'ffaa.lealtadAerea': -5,
          'ffaa.lealtadArmada': -5,
          'ffaa.lealtadEjercito': 5,
          'opp.relacionesPN': -1,
          'pais.presupuestoNacional': 3,
        },
      },
      {
        texto: 'Compensar a las empresas',
        intensidad: 1,
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
    titulo: 'Reorganización del Gabinete',
    descripcion: 'Ante la creciente tensión social y la sospecha por parte de sectores de la izquierda de un golpe de estado, el Presidente Allende ha decido reorganizar su gabinete.',
    opciones: [
      {
        texto: 'Nombrar generales en posiciones claves del gobierno',
        intensidad: 5,
        efectos: {
          'ffaa.lealtadEjercito': 2,
          'ffaa.lealtadAerea': 2,
          'polls.up': -0.5,
          'partido.cohesionPartidaria': -5,
          'partido.militarizacionMIR': 1,
        },
      },
      {
        texto: 'Mantener un gabinete estrictamente civil',
        intensidad: 1,
        efectos: {
          'partido.cohesionPartidaria': 3,
          'ffaa.lealtadEjercito': -4,
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
        intensidad: 6, // muy polémico para la clase media
        efectos: {
          'polls.up': 3,
          'opp.relacionesDC': -2,
          'partido.militarizacionMIR': 1,
          'pais.desempleo': 1,
        },
      },
      {
        texto: 'Liberalizar la distribución',
        intensidad: 2,
        efectos: {
          'pais.inflacion': -0.5,
          'opp.relacionesDC': 1,
          'polls.dc': 0.5,
        },
      },
    ],
  },
];
