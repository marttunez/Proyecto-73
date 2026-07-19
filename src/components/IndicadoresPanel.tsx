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
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16 }}>
      <span>{label}</span>
      <strong>{typeof value === 'number' ? value.toFixed(2) : value}</strong>
    </div>
  );
}

export function IndicadoresPanel({ state }: Props) {
  return (
    <div style={{ border: '1px solid #444', borderRadius: 8, padding: 16, maxWidth: 400}}>
      <h4>Mes {state.turno} / 12</h4>

      <h5>Derivados</h5>
      <Fila label="Apoyo Popular" value={apoyoPopular(state)} />
      <Fila label="Tensión Social" value={tensionSocial(state)} />
      <Fila label="Tensión Militar" value={tensionMilitar(state)} />
      <Fila label="Fuerza Oposición" value={fuerzaOposicion(state)} />
      <Fila label="Polarización" value={polarizacion(state)} />
      <Fila label="Riesgo Paramilitar" value={riesgoParamilitar(state)} />

      <h5>Encuestas</h5>
      <Fila label="UP" value={state.polls.up} />
      <Fila label="DC" value={state.polls.dc} />
      <Fila label="PN" value={state.polls.pn} />
      <Fila label="DR" value={state.polls.dr} />

      <h5>Partido</h5>
      <Fila label="Cohesión" value={state.partido.cohesionPartidaria} />
      <Fila label="Riesgo Fractura Partido" value={riesgoFracturaPartido(state)} />
      <Fila label="Presupuesto" value={state.partido.presupuestoPartido} />
      <Fila label="Militarización MIR" value={state.partido.militarizacionMIR} />

      <h5>País</h5>
      <Fila label="Inflación" value={state.pais.inflacion} />
      <Fila label="Desempleo" value={state.pais.desempleo} />

      <h5>FFAA (lealtad)</h5>
      <Fila label="Ejército" value={state.ffaa.lealtadEjercito} />
      <Fila label="Armada" value={state.ffaa.lealtadArmada} />
      <Fila label="Aérea" value={state.ffaa.lealtadAerea} />
      <Fila label="Carabineros" value={state.ffaa.lealtadCarabineros} />
    </div>
  );
}
