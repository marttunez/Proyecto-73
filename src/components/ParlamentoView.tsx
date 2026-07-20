import { type AsientoPartido, type ResultadoElectoral} from '../model/parlamento';

interface Props {
  escanos: AsientoPartido[];
  resultado: ResultadoElectoral;
  onReiniciar: () => void;
}

const COLOR_PARTIDO: Record<string, string> = {
  up: '#c0392b',
  dr: '#8e44ad',
  dc: '#2980b9',
  pn: '#7f8c8d',
};

const NOMBRE_PARTIDO: Record<string, string> = {
  up: 'Unidad Popular',
  dr: 'Democracia Radical',
  dc: 'Democracia Cristiana',
  pn: 'Partido Nacional',
};

// Orden político de izquierda a derecha, usado tanto para pintar el hemiciclo
// como para la leyenda debajo.
const ORDEN_IZQUIERDA_DERECHA: Array<keyof typeof COLOR_PARTIDO> = ['up', 'dr', 'dc', 'pn'];

const MENSAJE_RESULTADO: Record<ResultadoElectoral, string> = {
  victoria: '¡VICTORIA! La UP alcanza los dos tercios necesarios para profundizar el proceso.',
  empate: 'PARLAMENTO DIVIDIDO. Ningún bloque logra un control claro.',
  derrota: 'DERROTA. La oposición controla el Congreso; el gobierno queda en una posición crítica.',
};

interface AsientoPos {
  x: number;
  y: number;
  angulo: number; // radianes, PI = extremo izquierdo, 0 = extremo derecho
}

/**
 * Genera las posiciones (x, y) de un hemiciclo real: se van agregando filas
 * concéntricas (radio creciente) hasta cubrir 'total' asientos, manteniendo
 * el espaciado entre asientos consistente dentro de cada fila. El origen
 * (0, 0) queda en el centro de la base del semicírculo.
 */
function generarPosicionesHemiciclo(total: number): AsientoPos[] {
  const RADIO_ASIENTO = 9;
  const ESPACIADO_ASIENTO = RADIO_ASIENTO * 2 + 5; // separación centro a centro dentro de una fila
  const ESPACIADO_FILA = RADIO_ASIENTO * 2 + 7; // separación entre filas (radios)
  const RADIO_INICIAL = 55;

  const posiciones: AsientoPos[] = [];
  let radio = RADIO_INICIAL;

  while (posiciones.length < total) {
    const largoArco = Math.PI * radio; // longitud del semicírculo a este radio
    let asientosEnFila = Math.max(1, Math.round(largoArco / ESPACIADO_ASIENTO));
    if (posiciones.length + asientosEnFila > total) {
      asientosEnFila = total - posiciones.length;
    }

    for (let i = 0; i < asientosEnFila; i++) {
      const angulo = asientosEnFila === 1 ? Math.PI / 2 : Math.PI - (i / (asientosEnFila - 1)) * Math.PI;
      posiciones.push({
        x: radio * Math.cos(angulo),
        y: -radio * Math.sin(angulo),
        angulo,
      });
    }

    radio += ESPACIADO_FILA;
  }

  return posiciones;
}

/**
 * Asigna un código de partido a cada posición del hemiciclo. Las posiciones
 * se ordenan globalmente por ángulo (izquierda a derecha) y se les asigna
 * partido en bloques contiguos según ORDEN_IZQUIERDA_DERECHA — así se forman
 * las cuñas de color típicas de un diagrama parlamentario real.
 */
function asignarPartidosAHemiciclo(
  posiciones: AsientoPos[],
  escanos: AsientoPartido[]
): Array<AsientoPos & { partido: string }> {
  const ordenadas = [...posiciones].sort((a, b) => b.angulo - a.angulo); // PI -> 0, izquierda a derecha

  const conteoPorPartido = new Map<keyof typeof COLOR_PARTIDO, number>(
    escanos.map((e) => [e.partido as keyof typeof COLOR_PARTIDO, e.escanos] as [keyof typeof COLOR_PARTIDO, number])
  );
  const secuenciaPartidos: string[] = [];
  for (const partido of ORDEN_IZQUIERDA_DERECHA) {
    const cantidad = conteoPorPartido.get(partido) ?? 0;
    for (let i = 0; i < cantidad; i++) secuenciaPartidos.push(partido);
  }

  return ordenadas.map((pos, i) => ({ ...pos, partido: secuenciaPartidos[i] ?? 'pn' }));
}

export function ParlamentoView({ escanos, resultado, onReiniciar }: Props) {
  const escanosUP = escanos.find((e) => e.partido === 'up')?.escanos ?? 0;
  const total = escanos.reduce((acc, e) => acc + e.escanos, 0);

  const posiciones = generarPosicionesHemiciclo(total);
  const asientos = asignarPartidosAHemiciclo(posiciones, escanos);

  const RADIO_ASIENTO = 9;
  const PADDING = RADIO_ASIENTO + 6;
  const minX = Math.min(...asientos.map((a) => a.x)) - PADDING;
  const maxX = Math.max(...asientos.map((a) => a.x)) + PADDING;
  const minY = Math.min(...asientos.map((a) => a.y)) - PADDING;
  const maxY = 0 + PADDING;
  const ancho = maxX - minX;
  const alto = maxY - minY;

  return (
    <div style={{ padding: 24, maxWidth: 760, margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center' }}>Marzo de 1973 — Resultado Parlamentario</h2>
      <svg
        viewBox={`${minX} ${minY} ${ancho} ${alto}`}
        style={{ width: '100%', height: 'auto', margin: '24px 0' }}
      >
        {asientos.map((a, i) => (
          <circle key={i} cx={a.x} cy={a.y} r={RADIO_ASIENTO} fill={COLOR_PARTIDO[a.partido]}>
            <title>{NOMBRE_PARTIDO[a.partido]}</title>
          </circle>
        ))}
        <text x={0} y={-6} textAnchor="middle" fontSize={28} fontWeight="bold" fill="#333">
          {total}
        </text>
      </svg>

      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        {ORDEN_IZQUIERDA_DERECHA.map((partido) => {
          const a = escanos.find((e) => e.partido === partido);
          if (!a) return null;
          return (
            <div key={partido} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: 16,
                  height: 16,
                  background: COLOR_PARTIDO[partido],
                  display: 'inline-block',
                  borderRadius: '50%',
                  marginRight: 6,
                }}
              />
              <strong>{NOMBRE_PARTIDO[partido]}</strong>
              <div>
                {a.escanos} escaños ({a.porcentaje.toFixed(1)}%)
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          textAlign: 'center',
          padding: 16,
          borderRadius: 8,
          fontSize: 18,
          fontWeight: 'bold',
          color: '#fff',
          background: resultado === 'victoria' ? '#27ae60' : resultado === 'derrota' ? '#c0392b' : '#7f8c8d',
        }}
      >
        {MENSAJE_RESULTADO[resultado]}
      </div>

      <p style={{ textAlign: 'center', marginTop: 12 }}>
        La UP obtuvo {escanosUP} de {total} escaños.
      </p>

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <button onClick={onReiniciar}>Jugar de nuevo</button>
      </div>
    </div>
  );
}
