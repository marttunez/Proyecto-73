import type { Carta, Opcion } from '../model/contentTypes';

interface Props {
  carta: Carta;
  onElegir: (opcion: Opcion) => void;
}

export function OpcionesCarta({ carta, onElegir }: Props) {
  return (
    <div style={{ border: '1px solid #444', borderRadius: 8, padding: 16, marginTop: 16, maxWidth: 420 }}>
      <h4>{carta.titulo}</h4>
      <p>{carta.descripcion}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {carta.opciones.map((opcion, i) => (
          <button
            key={i}
            onClick={() => onElegir(opcion)}
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
