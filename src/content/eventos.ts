import type { Evento } from '../model/contentTypes';

export const eventos: Evento[] = [
  {
    id: 'paro_camioneros',
    titulo: 'Paro de Camioneros',
    descripcion: 'El gremio de camioneros ha amenazdo al Ministro de Transporte con un paro nacional si las condiciones de los transportistas no son aceptadas. Una paralización de este tipo podría afectar la distribución de alimentos y productos a lo largo de todo el país. Sectores moderados dentro del gobierno solicitan discutir las demandas mientras que los aliados de Altamirano llaman a "reprimir a los golpistas"',
    opciones: [
      {
        texto: 'Ordenar al Ministerio de Transporte abrir mesas de diálogo con los camioneros',
        intensidad: 2,
        efectos: {
          'pais.presupuestoNacional': -1,
          'polls.dc': 0.5,
          'opp.relacionesPN': 0.5,
          'partido.cohesionPartidaria': -1,
        },
      },
      {
        texto: 'Ordenar a Carabineros y Militares reprimir el paro de camioneros',
        intensidad: 7,
        efectos: {
          'ffaa.lealtadEjercito': -5,
          'ffaa.lealtadCarabineros': -15,
          'polls.up': -1,
          'partido.registradosMIR': 1000,
          'opp.militarizacionPyL': 1,
        },
      },
    ],
  },
  {
    id: 'manifestacion_opp',
    titulo: 'Las cacerolas se escuchan en La Moneda',
    descripcion: 'La oposición ha convoca una marcha masiva, liderada por amas de casas y jovenes universitarios de la Universidad Catóilica. Se espera que la marcha llegue hasta La Moneda, los sectores más radicales del gobierno piden la intervención de las fuerzas de orden.',
    opciones: [
      {
        texto: 'Permitir que la marcha se desarrolle con normalidad',
        intensidad: 1,
        efectos: {
          'opp.relacionesDC': 1,
          'partido.cohesionPartidaria': -3,
          'opp.militarizacionPyL': 1,
          'polls.dc': 0.3,
        },
      },
      {
        texto: 'Ordenar a Carabineros reprimer la manifestación',
        intensidad: 8,
        efectos: {
          'ffaa.lealtadCarabineros': -4.5,
          'polls.up': -1.5,
          'polls.dc': -0.5,
          'polls.pn': 2.5,
          'partido.cohesionPartidaria': -1,
          'opp.relacionesDC': -1,
          'opp.militarizacionPyL': 2,
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
        intensidad: 4,
        efectos: {
          'pais.presupuestoNacional': -1,
          'polls.up': 2.5,
          'opp.relacionesDC': -1,
        },
      },
      {
        texto: 'No intervenir',
        intensidad: 0,
        efectos: {
          'partido.cohesionPartidaria': -1,
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
        intensidad: 6,
        efectos: {
          'ffaa.lealtadEjercito': -10,
          'ffaa.lealtadAerea': -5,
          'polls.up': 1.5,
        },
      },
      {
        texto: 'Ignorar el rumor para no generar más tensión',
        intensidad: 1,
        efectos: {
          'ffaa.lealtadEjercito': -1,
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
        intensidad: 5,
        efectos: {
          'polls.up': 1.5,
          'opp.relacionesPN': -1,
          'pais.presupuestoNacional': -1,
        },
      },
      {
        texto: 'Ordenar el desalojo',
        intensidad: 4,
        efectos: {
          'ffaa.lealtadCarabineros': -2,
          'partido.militarizacionMIR': 1,
          'polls.dc': 0.3,
          'pais.presupuestoNacional': 1,
        },
      },
    ],
  },
];
