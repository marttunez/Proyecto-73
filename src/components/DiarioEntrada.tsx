import type { Opcion } from '../model/contentTypes';

interface Props {
  titulo: string;
  descripcion: string;
  etiqueta: string; // ej. "Memoria de Partido", "Memoria de Gobierno", "Suceso del mes"
  colorAcento: string;
  opciones: Opcion[];
  onElegir: (opcion: Opcion) => void;
}

export function DiarioEntrada({ titulo, descripcion, etiqueta, colorAcento, opciones, onElegir }: Props) {
  return (
    <div
      style={{
        border: `2px solid ${colorAcento}`,
        borderRadius: 6,
        padding: '32px 40px',
        maxWidth: 560,
        width: '100%',
        background: '#fdfaf3',
        boxShadow: '0 8px 28px rgba(0,0,0,0.25)',
      }}
    >
      <div
        style={{
          fontSize: 14,
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: colorAcento,
          marginBottom: 8,
        }}
      >
        {etiqueta}
      </div>

      <h2
        style={{
          marginTop: 0,
          marginBottom: 18,
          paddingBottom: 14,
          borderBottom: `1px solid ${colorAcento}55`,
        }}
      >
        {titulo}
      </h2>

      <p style={{ fontSize: 18, lineHeight: 1.65, marginBottom: 30 }}>{descripcion}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {opciones.map((opcion, i) => (
          <button
            key={i}
            onClick={() => onElegir(opcion)}
            style={{
              width: '100%',
              padding: '14px 16px',
              fontSize: 18,
              borderRadius: 6,
              border: `1px solid ${colorAcento}`,
              background: '#fff',
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