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
      {evento.opciones.map((opcion, i) => (
        <button key={i} onClick={() => onDecidir(opcion)} style={{ display: 'block', marginBottom: 6 }}>
          {opcion.texto}
        </button>
      ))}
    </div>
  );
}
