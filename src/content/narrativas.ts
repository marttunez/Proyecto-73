import type { GameState } from '../model/types';
import { apoyoPopular, tensionSocial, tensionMilitar } from '../model/derived';

const MESES = [
  'Marzo de 1972',
  'Abril de 1972',
  'Mayo de 1972',
  'Junio de 1972',
  'Julio de 1972',
  'Agosto de 1972',
  'Septiembre de 1972',
  'Octubre de 1972',
  'Noviembre de 1972',
  'Diciembre de 1972',
  'Enero de 1973',
  'Febrero de 1973',
];

// Una línea de ambientación fija por mes. Se puede editar libremente sin
// tocar el resto del motor: es contenido puro.
const INTRO_MES: string[] = [
  'El Gobierno de la Unidad Popular enfrenta su segundo año en La Moneda, con un país dividido entre la esperanza de un cambio profundo y el temor a la ruptura institucional.',
  'El calor del verano austral no aplaca la disputa por el modelo económico. Cada decisión de este mes reordena las lealtades del tablero político.',
  'Las colas frente a los almacenes se alargan en algunos barrios, mientras en otros se celebra la expropiación de nuevos fundos y fábricas.',
  'La prensa de oposición y la prensa oficialista narran dos países distintos. La ciudadanía intenta descifrar cuál de los dos relatos se acerca más a lo real.',
  'Los cuarteles observan con atención creciente el rumbo de la coyuntura. El gobierno necesita cada aliado que pueda conservar.',
  'El invierno trae consigo nuevas urgencias: abastecimiento, transporte, y la pregunta persistente de hasta dónde puede llegar la "vía chilena".',
  'Se acerca el aniversario del gobierno. Los balances son, como todo en esta hora, profundamente contradictorios según quién los haga.',
  'El nuevo año trae ajustes de gabinete y nuevas tensiones dentro de la propia coalición gobernante.',
  'Faltan pocas semanas para la elección parlamentaria. Cada carta jugada este mes puede pesar en marzo.',
  'Es el mes de la elección. El país entero mira hacia las urnas mientras la coyuntura sigue moviéndose bajo sus pies.',
  'Resuelta la elección, el nuevo Congreso empieza a definir el margen de maniobra real del gobierno para lo que queda de su mandato.',
  'Se cierra el ciclo de este relato. Lo que ocurrió en estos doce meses ya es, para bien o para mal, historia.',
];

export function tituloMes(turno: number): string {
  return MESES[turno - 1] ?? `Mes ${turno}`;
}

/**
 * Combina la línea fija del mes con un comentario dinámico que depende del
 * estado actual del juego, para que la narrativa se sienta reactiva a las
 * decisiones tomadas hasta ahora.
 */
export function generarNarrativa(turno: number, game: GameState): string {
  const intro = INTRO_MES[turno - 1] ?? 'El país sigue su curso, cada vez más incierto.';

  const apoyo = apoyoPopular(game);
  const tSocial = tensionSocial(game);
  const tMilitar = tensionMilitar(game);

  let comentario: string;
  if (tMilitar > 55) {
    comentario = 'En los cuarteles con cada día que pasa se siente más el descontento de los altos mandos con la dirección que el gobierno está llevando al país. La tensión militar se percibe en el aire.';
  } else if (tSocial > 20) {
    comentario = 'Como una hoya a presión, la ciudadanía se muestra cada vez más polarizada, mientras el gobierno intenta mantener la institucionalidad la oposición crece y se radicaliza.';
  } else if (apoyo > 42) {
    comentario = 'El mensaje que se escucha en las calles de la capital es claro: Venceremos.';
  } else {
    comentario = 'La situación a nivel país es incierta, mientras los reaccionarios intentan asustar a la población las fuerzas de gobierno discuten como timonear el gobierno.';
  }

  return `${intro} ${comentario}`;
}