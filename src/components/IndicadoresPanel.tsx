import { useState } from 'react';
import type { GameState } from '../model/types';
import {
  apoyoPopular,
  tensionMilitar,
  tensionSocial,
  fuerzaOposicion,
  polarizacion,
  riesgoFracturaPartido,
  riesgoParamilitar,
} from '../model/derived';

interface Props {
  state: GameState;
}

function Fila({ label, value }: { label: string; value: number | string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '3px 0' }}>
      <span>{label}</span>
      <strong>{typeof value === 'number' ? value.toFixed(2) : value}</strong>
    </div>
  );
}

type Tab = 'derivados' | 'encuestas' | 'partido' | 'ffaa';

const TABS: { key: Tab; label: string }[] = [
  { key: 'derivados', label: 'Derivados' },
  { key: 'encuestas', label: 'Encuestas' },
  { key: 'partido', label: 'Partido y País' },
  { key: 'ffaa', label: 'FFAA' },
];

const BORDE = '#777';

export function IndicadoresPanel({ state }: Props) {
  const [tab, setTab] = useState<Tab>('derivados');

  return (
    <div style={{ width: 340 }}>
      <h4 style={{ marginTop: 0, marginBottom: 12 }}>Turno {state.turno} / 12</h4>

      {/* Pestañas horizontales estilo carpeta */}
      <div style={{ display: 'flex' }}>
        {TABS.map((t) => {
          const activa = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                flex: 1,
                padding: '10px 8px',
                fontSize: 18,
                fontWeight: 'bold',
                border: `1px solid ${BORDE}`,
                borderBottom: activa ? '1px solid transparent' : `1px solid ${BORDE}`,
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                marginRight: -1, // pestañas pegadas entre sí, como carpetas
                background: activa ? '#2a2a2a' : '#1b1b1b',
                color: activa ? '#fff' : '#888',
                cursor: 'pointer',
                position: 'relative',
                zIndex: activa ? 2 : 1,
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Contenido de la pestaña activa, conectado visualmente (sin borde superior)
          para que se vea "colgando" de la pestaña seleccionada */}
      <div
        style={{
          border: `1px solid ${BORDE}`,
          borderTop: 'none',
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          padding: 16,
          background: '#2a2a2a',
        }}
      >
        {tab === 'derivados' && (
          <div>
            <Fila label="Apoyo Popular" value={apoyoPopular(state)} />
            <Fila label="Tensión Social" value={tensionSocial(state)} />
            <Fila label="Tensión Militar" value={tensionMilitar(state)} />
            <Fila label="Fuerza Oposición" value={fuerzaOposicion(state)} />
            <Fila label="Polarización" value={polarizacion(state)} />
            <Fila label="Riesgo Fractura Partido" value={riesgoFracturaPartido(state)} />
            <Fila label="Riesgo Paramilitar" value={riesgoParamilitar(state)} />
          </div>
        )}

        {tab === 'encuestas' && (
          <div>
            <Fila label="UP" value={state.polls.up} />
            <Fila label="DC" value={state.polls.dc} />
            <Fila label="PN" value={state.polls.pn} />
            <Fila label="DR" value={state.polls.dr} />
          </div>
        )}

        {tab === 'partido' && (
          <div>
            <h5 style={{ marginTop: 0 }}>Partido</h5>
            <Fila label="Cohesión" value={state.partido.cohesionPartidaria} />
            <Fila label="Presupuesto" value={state.partido.presupuestoPartido} />
            <Fila label="Militarización MIR" value={state.partido.militarizacionMIR} />

            <h5>País</h5>
            <Fila label="Inflación" value={state.pais.inflacion} />
            <Fila label="Desempleo" value={state.pais.desempleo} />
            <Fila label="Presupuesto Nacional" value={state.pais.presupuestoNacional} />
          </div>
        )}

        {tab === 'ffaa' && (
          <div>
            <Fila label="Ejército" value={state.ffaa.lealtadEjercito} />
            <Fila label="Armada" value={state.ffaa.lealtadArmada} />
            <Fila label="Aérea" value={state.ffaa.lealtadAerea} />
            <Fila label="Carabineros" value={state.ffaa.lealtadCarabineros} />
          </div>
        )}
      </div>
    </div>
  );
}