import { Facet } from '../facet'
import { LogEntry } from '../log'

import { ActionExecutor, createActionExecutor } from './action-executor'
import { createActionHandlerFactory } from './action-handler-factory'

/** Configuration metadata and dependencies used to bootstrap a new simulation. */
export interface SimulationConfig {
  /** Executor used to process actions, and calculate the necessary world StateChanges. */
  actionExecutor: ActionExecutor

  /** Callback used to append simulation events to the game log. */
  log: (logEntry: LogEntry) => void
}

/** Creates a new SimulationConfig for a simulation that will support the supplied set of Facets. */
export const createSimulationConfig = (facets = [] as Facet[]): SimulationConfig => ({
  actionExecutor: createActionExecutor(createActionHandlerFactory(facets)),
  // eslint-disable-next-line no-console
  log: (logEntry) => console.log(logEntry),
})
