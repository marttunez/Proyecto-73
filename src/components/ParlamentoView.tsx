import { type AsientoPartido, type ResultadoElectoral, ESCANOS_PARA_VICTORIA, ESCANOS_PARA_DERROTA } from '../model/parlamento';

interface Props {
  escanos: AsientoPartido[];
  resultado: ResultadoElectoral;
  onReiniciar: () => void;
}

const COLOR_PARTIDO: Record<string, string> = {
  up: '#c0392b',
  dc: '#2980b9',
  pn: '#7f8c8d',
  dr: '#8e44ad',
};

const NOMBRE_PARTIDO: Record<string, string> = {
  up: 'Unidad Popular',
  dc: 'Democracia Cristiana',
  pn: 'Partido Nacional',
  dr: 'Democracia Radical',
};

const MENSAJE_RESULTADO: Record<ResultadoElectoral, string> = {
  victoria: '¡VICTORIA! La UP alcanza los dos tercios necesarios para profundizar el proceso.',
  empate: 'PARLAMENTO DIVIDIDO. Ningún bloque logra un control claro.',
  derrota: 'DERROTA. La oposición controla el Congreso; el gobierno queda en una posición crítica.',
};

function construirGrillaEscanos(escanos: AsientoPartido[]): string[] {
  // arma un arreglo plano de 120 códigos de partido, en orden, para pintar la grilla
  const orden: string[] = [];
  for (const a of escanos) {
    for (let i = 0; i < a.escanos; i++) orden.push(a.partido);
  }
  return orden;
}

export function ParlamentoView({ escanos, resultado, onReiniciar }: Props) {
  const escanosUP = escanos.find((e) => e.partido === 'up')?.escanos ?? 0;
  const grilla = construirGrillaEscanos(escanos);

  return (
    <div style={{ padding: 24, maxWidth: 720, margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center' }}>Marzo de 1973 — Resultado Parlamentario</h2>
      <p style={{ textAlign: 'center', fontSize: 16 }}>
        Umbral de victoria: {ESCANOS_PARA_VICTORIA}+ escaños UP · Umbral de derrota: {ESCANOS_PARA_DERROTA}- escaños
        UP
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(20, 1fr)',
          gap: 4,
          margin: '24px 0',
        }}
      >
        {grilla.map((partido, i) => (
          <div
            key={i}
            title={NOMBRE_PARTIDO[partido]}
            style={{
              width: '100%',
              paddingBottom: '100%',
              borderRadius: 3,
              background: COLOR_PARTIDO[partido],
            }}
          />
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 24 }}>
        {escanos.map((a) => (
          <div key={a.partido} style={{ textAlign: 'center' }}>
            <div
              style={{
                width: 16,
                height: 16,
                background: COLOR_PARTIDO[a.partido],
                display: 'inline-block',
                borderRadius: 3,
                marginRight: 6,
              }}
            />
            <strong>{NOMBRE_PARTIDO[a.partido]}</strong>
            <div>
              {a.escanos} escaños ({a.porcentaje.toFixed(1)}%)
            </div>
          </div>
        ))}
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

      <p style={{ textAlign: 'center', marginTop: 12 }}>La UP obtuvo {escanosUP} de 120 escaños.</p>

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <button onClick={onReiniciar}>Jugar de nuevo</button>
      </div>
    </div>
  );
}
