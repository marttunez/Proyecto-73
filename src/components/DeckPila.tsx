interface Props {
  titulo: string;
  cartasRestantes: number;
  disabled: boolean;
  onClick: () => void;
}

export function DeckPila({ titulo, cartasRestantes, disabled, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 120,
        height: 200,
        border: '1px solid #555',
        borderRadius: 8,
        background: disabled ? '#eee' : '#f5f5f5',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
      }}
    >
      <strong>{titulo}</strong>
      <span style={{ fontSize: 12, color: '#666' }}>{cartasRestantes} cartas</span>
    </button>
  );
}
