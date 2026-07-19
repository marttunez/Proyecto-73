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
      {carta.opciones.map((opcion, i) => (
        <button
          key={i}
          onClick={() => onElegir(opcion)}
          style={{ display: 'block', width: '100%', marginBottom: 6 }}
        >
          {opcion.texto}
        </button>
      ))}
    </div>
  );
}
