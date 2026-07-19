import type { Evento, Opcion } from '../model/contentTypes';

interface Props {
  evento: Evento;
  onDecidir: (opcion: Opcion) => void;
}

export function EventoView({ evento, onDecidir }: Props) {
  return (
    <div style={{ border: '2px solid #c00', borderRadius: 8, padding: 16, maxWidth: 480 }}>
      <h3>⚠ {evento.titulo}</h3>
      <p>{evento.descripcion}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {evento.opciones.map((opcion, i) => (
          <button
            key={i}
            onClick={() => onDecidir(opcion)}
            style={{
              width: '100%',
              padding: '14px 16px',
              fontSize: 17,
              borderRadius: 6,
              border: '1px solid #999',
              cursor: 'pointer',
            }}
          >
            {opcion.texto}
          </button>
        ))}
      </div>
    </div>
  );
}
