import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export function DiarioModal({ children }: Props) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        zIndex: 50,
      }}
    >
      {children}
    </div>
  );
}