import { useReducer } from 'react';
import { appReducer, crearAppStateInicial } from './model/appState';
import { DeckPila } from './components/DeckPila';
import { ManoActual } from './components/ManoActual';
import { DiarioEntrada } from './components/DiarioEntrada';
import { DiarioModal } from './components/DiarioModal';
import { EventosMinimizados } from './components/EventoMinimizado';
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

            <h4 style={{ marginTop: 24 }}>Mano — clic para abrir</h4>
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
            <DiarioEntrada
              titulo={state.eventoSeleccionado.titulo}
              descripcion={state.eventoSeleccionado.descripcion}
              etiqueta="NOTICIAS | EL NACIONAL"
              colorAcento="#c0392b"
              opciones={state.eventoSeleccionado.opciones}
              onElegir={jugarEvento}
            />
          </DiarioModal>
        )}
      </div>

      <IndicadoresPanel state={state.game} />
    </div>
  );
}

export default App;