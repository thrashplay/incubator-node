import { getType } from 'typesafe-actions'

import { CommonAction, CommonActions } from '../common/action'

import { RulesAction } from './actions'
import { RulesState } from './state'

export const reduceRulesState = (state: RulesState, action: RulesAction | CommonAction): RulesState => {
  switch (action.type) {
    case getType(CommonActions.initialized):
      return {
        movement: {
          defaultMode: 'hustle',
          modes: {
            cautious: {
              id: 'cautious',
              name: 'Cautious',
              multiplier: 0.1,
            },
            hustle: {
              id: 'hustle',
              name: 'Hustle',
              multiplier: 1,
            },
            run: {
              id: 'run',
              name: 'Run',
              multiplier: 2,
            },
          },
        },
      }

    default:
      return state
  }
}