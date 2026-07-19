import type { GameState } from './types';

export type EffectPath =
  | `partido.${keyof GameState['partido']}`
  | `pais.${keyof GameState['pais']}`
  | `ffaa.${keyof GameState['ffaa']}`
  | `opp.${keyof GameState['opp']}`
  | `polls.${keyof GameState['polls']}`;

export type Effects = Partial<Record<EffectPath, number>>; // delta a sumar

export function applyEffects(state: GameState, effects: Effects): GameState {
  const next: GameState = {
    ...state,
    partido: { ...state.partido },
    pais: { ...state.pais },
    ffaa: { ...state.ffaa },
    opp: { ...state.opp },
    polls: { ...state.polls },
  };

  for (const [path, delta] of Object.entries(effects)) {
    const [group, key] = path.split('.') as [keyof GameState, string];
    const target = next[group] as unknown as Record<string, number>;
    target[key] = target[key] + (delta as number);
  }

  return next;
}
