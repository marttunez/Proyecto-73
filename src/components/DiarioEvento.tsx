import type {Evento, Opcion} from '../model/contentTypes';
import { motivoNoFactible, opcionEsFactible } from '../model/factibilidad';
import type { GameState } from '../model/types';

interface Props {
    evento: Evento;
    opcionesActuales: Opcion[] | null;
    resultado: string | null;
    pregunta: string | null;
    game: GameState
    onDecidir: (opcion: Opcion) => void;
    onContinuar: () => void;
}

const COLOR_ACENTO = '#c0392b';

export function DiarioEvento({ evento, opcionesActuales, resultado, pregunta, game, onDecidir, onContinuar }: Props) {
  return (
    <div
      style={{
        border: `2px solid ${COLOR_ACENTO}`,
        borderRadius: 6,
        padding: '32px 40px',
        maxWidth: 560,
        width: '100%',
        background: '#515151',
        boxShadow: '0 8px 28px rgba(0,0,0,0.25)',
      }}
    >
      <div
        style={{
          fontSize: 13,
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: COLOR_ACENTO,
          marginBottom: 8,
        }}
      >
        Diario | el nacional
      </div>
 
      <h2
        style={{
          marginTop: 0,
          marginBottom: 18,
          paddingBottom: 14,
          borderBottom: `1px solid ${COLOR_ACENTO}55`,
        }}
      >
        {evento.titulo}
      </h2>
 
      <p style={{ fontSize: 18, lineHeight: 1.65, marginBottom: resultado ? 20 : 30 }}>
        {evento.descripcion}
      </p>
 
      {resultado && (
        <>
          <div style={{ borderTop: `1px dashed ${COLOR_ACENTO}55`, margin: '20px 0' }} />
          <p style={{ fontSize: 17, lineHeight: 1.6, marginBottom: opcionesActuales ? 20 : 30 }}>{resultado}</p>
        </>
      )}
 
      {opcionesActuales && pregunta && (
        <p style={{ fontSize: 15, color: '#666', marginBottom: 12 }}>{pregunta}</p>
      )}
 
      {opcionesActuales ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {opcionesActuales.map((opcion, i) => {
            const factible = opcionEsFactible(opcion, game);
            return (
              <div key={i}>
                <button
                  onClick={() => factible && onDecidir(opcion)}
                  disabled={!factible}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    fontSize: 17,
                    borderRadius: 6,
                    border: `1px solid ${factible ? COLOR_ACENTO : '#555'}`,
                    background: factible ? '#fff' : '#e8e8e8',
                    color: factible ? '#000' : '#888',
                    cursor: factible ? 'pointer' : 'not-allowed',
                  }}
                >
                  {opcion.texto}
                </button>
                {!factible && (
                  <p style={{ fontSize: 12, color: '#c0392b', margin: '4px 2px 0' }}>
                    {motivoNoFactible(opcion, game)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <button
          onClick={onContinuar}
          style={{
            width: '100%',
            padding: '14px 16px',
            fontSize: 17,
            borderRadius: 6,
            border: 'none',
            background: COLOR_ACENTO,
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Continuar
        </button>
      )}
    </div>
  );
}
 