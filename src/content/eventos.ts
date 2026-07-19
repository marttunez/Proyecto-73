import type { Evento } from '../model/contentTypes';

export const eventos: Evento[] = [
  {
    id: 'paro_camioneros',
    titulo: 'Paro de Camioneros',
    descripcion: 'Gremios de transporte amenazan con paralizar el país.',
    opciones: [
      {
        texto: 'Negociar concesiones',
        intensidad: 2,
        efectos: {
          'pais.presupuestoNacional': -1,
          'polls.dc': -0.5,
          'opp.relacionesPN': 0.5,
        },
        // Ejemplo de resultado CONDICIONAL: el texto cambia según cómo
        // quedó el presupuesto nacional tras aplicar los efectos.
        resultado: {
          texto: (s) => s.pais.presupuestoNacional < 2
            ? 'Las arcas fiscales quedan exhaustas tras la negociación, pero el paro se levanta sin mayores incidentes.'
            : 'El paro se levanta tras una negociación que deja satisfechos a ambos lados, sin comprometer mayormente las finanzas públicas.',
          preguntaSiguiente: null,
          siguientesOpciones: undefined
        },
      },
      {
        texto: 'Militarizar rutas',
        intensidad: 7,
        efectos: {
          'ffaa.lealtadEjercito': -2,
          'polls.up': -1,
          'opp.militarizacionPyL': 1,
        },
        // Ejemplo de resultado que ADEMÁS abre una nueva decisión anidada,
        // dentro del mismo evento, dependiendo de la lealtad del Ejército.
        resultado: {
          texto: (s) =>
            s.ffaa.lealtadEjercito < 60
              ? 'Los oficiales a cargo cumplen la orden a regañadientes. Circulan rumores de descontento en los cuarteles.'
              : 'Las tropas despliegan sin mayores objeciones y las rutas se despejan en 48 horas.',
          preguntaSiguiente: '¿Cómo manejas el malestar en la oficialidad?',
          siguientesOpciones: [
            {
              texto: 'Ofrecer garantías públicas a la oficialidad',
              intensidad: 1,
              efectos: { 'ffaa.lealtadEjercito': 1.5 },
              resultado: {
                texto: 'El gesto calma parcialmente los ánimos castrenses. Los cuarteles vuelven a la rutina.',
              },
            },
            {
              texto: 'Ignorar el malestar y seguir adelante',
              intensidad: 5,
              efectos: { 'partido.militarizacionMIR': 1 },
              resultado: {
                texto:
                  'El malestar queda latente. El MIR interpreta la señal como luz verde para organizarse con mayor autonomía.',
              },
            },
          ],
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
        resultado: undefined
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
        resultado: undefined
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
        resultado: undefined
      },
      {
        texto: 'No intervenir',
        intensidad: 0,
        efectos: {
          'partido.cohesionPartidaria': -1,
          'polls.up': -0.3,
        },
        resultado: undefined
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
        resultado: undefined
      },
      {
        texto: 'Ignorar el rumor para no generar más tensión',
        intensidad: 1,
        efectos: {
          'ffaa.lealtadEjercito': -1,
          'partido.militarizacionMIR': 1,
        },
        resultado: undefined
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
        resultado: undefined
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
        resultado: undefined
      },
    ],
  },
];
