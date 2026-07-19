import type { Evento } from '../model/contentTypes';

export const eventos: Evento[] = [
  {
    id: 'paro_camioneros',
    titulo: 'Paro de Camioneros',
    descripcion: 'Gremios de transporte amenazan con paralizar el país.',
    opciones: [
      {
        texto: 'Negociar concesiones',
        efectos: {
          'pais.presupuestoNacional': -1,
          'polls.dc': -0.5,
          'opp.relacionesPN': 0.5,
        },
      },
      {
        texto: 'Militarizar rutas',
        efectos: {
          'ffaa.lealtadEjercito': -2,
          'polls.up': -1,
          'opp.militarizacionPyL': 1,
        },
      },
    ],
  },
  {
    id: 'manifestacion_opp',
    titulo: 'Manifestación Opositora',
    descripcion: 'La oposición convoca una marcha masiva (ej. "marcha de las cacerolas").',
    opciones: [
      {
        texto: 'Permitir la marcha',
        efectos: {
          'opp.relacionesDC': 1,
          'opp.militarizacionPyL': 1,
          'polls.dc': 0.5,
        },
      },
      {
        texto: 'Reprimir con Carabineros',
        efectos: {
          'ffaa.lealtadCarabineros': -1.5,
          'polls.up': -0.5,
          'partido.cohesionPartidaria': -1,
        },
      },
    ],
  },
  {
    id: 'eleccion_complementaria',
    titulo: 'Elección Parlamentaria Complementaria',
    descripcion: 'Un distrito realiza una elección complementaria; se pide apoyo del gobierno.',
    opciones: [
      {
        texto: 'Volcar recursos estatales a la campaña',
        efectos: {
          'pais.presupuestoNacional': -1,
          'polls.up': 1.5,
          'opp.relacionesDC': -1,
        },
      },
      {
        texto: 'No intervenir',
        efectos: {
          'partido.cohesionPartidaria': 1,
          'polls.up': -0.3,
        },
      },
    ],
  },
  {
    id: 'rumor_golpe',
    titulo: 'Rumores de Conspiración',
    descripcion: 'Inteligencia militar reporta reuniones sospechosas entre oficiales.',
    opciones: [
      {
        texto: 'Investigar y purgar oficiales sospechosos',
        efectos: {
          'ffaa.lealtadEjercito': -2,
          'ffaa.lealtadAerea': -1,
          'polls.up': 0.5,
        },
      },
      {
        texto: 'Ignorar el rumor para no generar más tensión',
        efectos: {
          'ffaa.lealtadEjercito': 1,
          'partido.militarizacionMIR': 1,
        },
      },
    ],
  },
  {
    id: 'toma_fabrica',
    titulo: 'Toma de Fábrica',
    descripcion: 'Trabajadores toman una fábrica textil exigiendo su estatización.',
    opciones: [
      {
        texto: 'Legalizar la toma',
        efectos: {
          'polls.up': 1,
          'opp.relacionesPN': -1,
          'pais.presupuestoNacional': -0.5,
        },
      },
      {
        texto: 'Ordenar el desalojo',
        efectos: {
          'ffaa.lealtadCarabineros': -1,
          'partido.militarizacionMIR': 1,
          'polls.dc': 0.3,
        },
      },
    ],
  },
];
