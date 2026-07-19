import type { Carta } from '../model/contentTypes';

interface Props {
  mano: Carta[];
  cartaSeleccionada: Carta | null;
  onSeleccionar: (carta: Carta) => void;
}

export function ManoActual({ mano, cartaSeleccionada, onSeleccionar }: Props) {
  if (mano.length === 0) return <p style={{ color: '#888' }}>Aún no tienes cartas en mano.</p>;

  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      {mano.map((carta) => {
        const activa = cartaSeleccionada?.id === carta.id;
        return (
          <button
            key={carta.id}
            onClick={() => onSeleccionar(carta)}
            style={{
              width: 120,
              height: 200,
              border: activa ? '2px solid #c00' : '1px solid #555',
              borderRadius: 8,
              background: carta.tipo === 'partido' ? '#fdf3e7' : '#e7f0fd',
              cursor: 'pointer',
              fontSize: 16,
              padding: 6,
            }}
          >
            {carta.titulo}
          </button>
        );
      })}
    </div>
  );
}
