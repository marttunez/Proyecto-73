import { useReducer } from 'react';
import { appReducer, crearAppStateInicial, LIMITE_MANO } from './model/appState';
import { tituloMes } from './content/narrativas';
import { NarrativaSuperior } from './components/NarrativaSuperior';
import { DeckPila } from './components/DeckPila';
import { ManoActual } from './components/ManoActual';
import { DiarioEntrada } from './components/DiarioEntrada';
import { DiarioEvento } from './components/DiarioEvento';
import { DiarioModal } from './components/DiarioModal';
import { IndicadoresPanel } from './components/IndicadoresPanel';
import { ParlamentoView } from './components/ParlamentoView';
import { FinAnticipadoView } from './components/FinAnticipadoView';
import type { Opcion } from './model/contentTypes';
import { EventosMinimizados } from './components/EventoMinimizado';

function App() {
  const [state, dispatch] = useReducer(appReducer, undefined, crearAppStateInicial);

  function jugarOpcion(opcion: Opcion) {
    dispatch({ type: 'JUGAR_OPCION', opcion });
  }

  function elegirOpcionEvento(opcion: Opcion) {
    dispatch({ type: 'ELEGIR_OPCION_EVENTO', opcion });
  }

  function continuarEvento() {
    dispatch({ type: 'CONTINUAR_EVENTO' });
  }

  if (state.fase === 'FIN' && state.resultadoFinal) {
    if (state.resultadoFinal.tipo === 'golpe') {
      return (
        <FinAnticipadoView
          mensaje={state.resultadoFinal.mensaje ?? 'El gobierno ha sido derrocado.'}
          onReiniciar={() => dispatch({ type: 'RESET' })}
        />
      );
    }
    return (
      <ParlamentoView
        escanos={state.resultadoFinal.escanos ?? []}
        resultado={state.resultadoFinal.resultado}
        onReiniciar={() => dispatch({ type: 'RESET' })}
      />
    );
  }

  const manoLlena = state.mano.length >= LIMITE_MANO;

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <NarrativaSuperior titulo={tituloMes(state.game.turno)} texto={state.narrativa} />

      <div style={{ display: 'flex', gap: 24, width: '100%', maxWidth: 960, justifyContent: 'center' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {state.fase === 'TURNO' && (
            <>
              <p>
                Robos restantes este turno: <strong>{state.robosRestantes}</strong>
              </p>

              <h4>Mazos — clic para robar</h4>
              <div style={{ display: 'flex', gap: 12 }}>
                <DeckPila
                  titulo="Partido"
                  cartasRestantes={state.mazoPartido.disponibles.length}
                  disabled={state.robosRestantes <= 0 || manoLlena}
                  onClick={() => dispatch({ type: 'ROBAR_CARTA', tipo: 'partido' })}
                />
                <DeckPila
                  titulo="Gobierno"
                  cartasRestantes={state.mazoGobierno.disponibles.length}
                  disabled={state.robosRestantes <= 0 || manoLlena}
                  onClick={() => dispatch({ type: 'ROBAR_CARTA', tipo: 'gobierno' })}
                />
              </div>

              <h4 style={{ marginTop: 24 }}>
                Mano — clic para abrir{' '}
                <span style={{ fontWeight: 'normal', fontSize: 14, color: manoLlena ? '#c0392b' : '#999' }}>
                  ({state.mano.length}/{LIMITE_MANO}
                  {manoLlena ? ' — mano llena' : ''})
                </span>
              </h4>
              <ManoActual
                mano={state.mano}
                cartaSeleccionada={state.cartaSeleccionada}
                onSeleccionar={(carta) => dispatch({ type: 'SELECCIONAR_CARTA', carta })}
              />

              {state.cartaSeleccionada && (
                <DiarioModal>
                  <DiarioEntrada
                    titulo={state.cartaSeleccionada.titulo}
                    descripcion={state.cartaSeleccionada.descripcion}
                    etiqueta={state.cartaSeleccionada.tipo === 'partido' ? 'Oficinas del Partido' : 'La Moneda'}
                    colorAcento={state.cartaSeleccionada.tipo === 'partido' ? '#8a6d3b' : '#2980b9'}
                    opciones={state.cartaSeleccionada.opciones}
                    game={state.game}
                    onElegir={jugarOpcion}
                  />
                </DiarioModal>
              )}
            </>
          )}

          {state.fase === 'EVENTO' && !state.eventoSeleccionado && (
            <EventosMinimizados
              eventos={state.eventosPendientes}
              onSeleccionar={(evento) => dispatch({ type: 'SELECCIONAR_EVENTO', evento })}
            />
          )}

          {state.fase === 'EVENTO' && state.eventoSeleccionado && (
            <DiarioModal>
              <DiarioEvento
                evento={state.eventoSeleccionado}
                opcionesActuales={state.eventoOpcionesActuales}
                resultado={state.eventoResultado}
                pregunta={state.eventoPregunta}
                game={state.game}
                onDecidir={elegirOpcionEvento}
                onContinuar={continuarEvento}
              />
            </DiarioModal>
          )}
        </div>

        <IndicadoresPanel state={state.game} />
      </div>
    </div>
  );
}

export default App;