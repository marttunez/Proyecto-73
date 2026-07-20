interface Props {
  titulo: string;
  texto: string;
}

export function NarrativaSuperior({ titulo, texto }: Props) {
  return (
    <div style={{ width: '100%', maxWidth: 720, textAlign: 'center', marginBottom: 8 }}>
      <h1
        style={{
          fontSize: 30,
          letterSpacing: 4,
          fontWeight: 'bold',
          marginBottom: 18,
          textTransform: 'uppercase',
        }}
      >
        {titulo}
      </h1>
      <p style={{ fontSize: 17, lineHeight: 1.75, textAlign: 'left', color: '#e8e6e1' }}>{texto}</p>
      <div style={{ borderBottom: '1px solid #555', marginTop: 22 }} />
    </div>
  );
}