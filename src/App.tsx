import { useReducer } from 'react';
import { appReducer, crearAppStateInicial } from './model/appState';
import { DeckPila } from './components/DeckPila';
import { ManoActual } from './components/ManoActual';
import { OpcionesCarta } from './components/OpcionesCarta';
import { EventoView } from './components/EventoView';
import { IndicadoresPanel } from './components/IndicadoresPanel';
import { ParlamentoView } from './components/ParlamentoView';
import type { Opcion } from './model/contentTypes';

function App() {
  const [state, dispatch] = useReducer(appReducer, undefined, crearAppStateInicial);

  function jugarOpcion(opcion: Opcion) {
    dispatch({ type: 'JUGAR_OPCION', opcion });
  }

  function jugarEvento(opcion: Opcion) {
    dispatch({ type: 'JUGAR_EVENTO', opcion });
  }

  if (state.fase === 'FIN' && state.resultadoFinal) {
    return (
      <ParlamentoView
        escanos={state.resultadoFinal.escanos}
        resultado={state.resultadoFinal.resultado}
        onReiniciar={() => dispatch({ type: 'RESET' })}
      />
    );
  }

  return (
    <div style={{ display: 'flex', gap: 24, padding: 24 }}>
      <div style={{ flex: 1 }}>
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
                disabled={state.robosRestantes <= 0}
                onClick={() => dispatch({ type: 'ROBAR_CARTA', tipo: 'partido' })}
              />
              <DeckPila
                titulo="Gobierno"
                cartasRestantes={state.mazoGobierno.disponibles.length}
                disabled={state.robosRestantes <= 0}
                onClick={() => dispatch({ type: 'ROBAR_CARTA', tipo: 'gobierno' })}
              />
            </div>

            <h4 style={{ marginTop: 24 }}>Mano — clic para jugar</h4>
            <ManoActual
              mano={state.mano}
              cartaSeleccionada={state.cartaSeleccionada}
              onSeleccionar={(carta) => dispatch({ type: 'SELECCIONAR_CARTA', carta })}
            />

            {state.cartaSeleccionada && (
              <OpcionesCarta carta={state.cartaSeleccionada} onElegir={jugarOpcion} />
            )}
          </>
        )}

        {state.fase === 'EVENTO' && state.eventosPendientes[0] && (
          <EventoView evento={state.eventosPendientes[0]} onDecidir={jugarEvento} />
        )}
      </div>

      <IndicadoresPanel state={state.game} />
    </div>
  );
}

export default App;
