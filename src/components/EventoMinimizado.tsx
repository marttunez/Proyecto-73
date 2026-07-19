import type { Evento } from '../model/contentTypes';

interface Props {
  eventos: Evento[];
  onSeleccionar: (evento: Evento) => void;
}

export function EventosMinimizados({ eventos, onSeleccionar }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 420 }}>
      <p style={{ fontStyle: 'italic', color: '#666', textAlign: 'center' }}>
        Sucesos pendientes este mes — elige uno para continuar:
      </p>
      {eventos.map((evento) => (
        <button
          key={evento.id}
          onClick={() => onSeleccionar(evento)}
          style={{
            width: '100%',
            padding: '14px 16px',
            fontSize: 16,
            textAlign: 'left',
            borderRadius: 6,
            border: '1px solid #c0392b',
            background: '#fdf2f1',
            cursor: 'pointer',
          }}
        >
          ⚠ {evento.titulo}
        </button>
      ))}
    </div>
  );
}