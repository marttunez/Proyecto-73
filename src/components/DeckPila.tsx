interface Props {
  titulo: string;
  cartasRestantes?: number;
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
        border: '1px solid #888',
        borderRadius: 8,
        background: disabled ? '#242424' : '#333',
        color: disabled ? '#666' : '#eee',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
      }}
    >
      <strong>{titulo}</strong>
    </button>
  );
}