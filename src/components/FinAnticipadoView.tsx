interface Props {
  mensaje: string;
  onReiniciar: () => void;
}

export function FinAnticipadoView({ mensaje, onReiniciar }: Props) {
  return (
    <div style={{ padding: 24, maxWidth: 640, margin: '80px auto', textAlign: 'center' }}>
      <h2 style={{ letterSpacing: 4, textTransform: 'uppercase' }}>Golpe de Estado</h2>
      <p style={{ fontSize: 18, lineHeight: 1.75, margin: '28px 0', textAlign: 'left' }}>{mensaje}</p>
      <div
        style={{
          padding: 16,
          borderRadius: 8,
          background: '#c0392b',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: 18,
        }}
      >
        FIN ANTICIPADO DE LA PARTIDA
      </div>
      <div style={{ marginTop: 24 }}>
        <button onClick={onReiniciar}>Jugar de nuevo</button>
      </div>
    </div>
  );
}