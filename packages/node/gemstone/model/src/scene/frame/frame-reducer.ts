import { flow, has } from 'lodash/fp'
import { getType } from 'typesafe-actions'

import { createReducerErrorHandler, isValidPoint } from '@thrashplay/gemstone-model'

import { CharacterId } from '../../character'

import { ActorStatus, Frame } from '.'
import { FrameAction, FrameActions } from './actions'

export const frameReducer = (frame: Frame, action: FrameAction): Frame => {
  const error = createReducerErrorHandler('frame', frame)

  switch (action.type) {
    case getType(FrameActions.actorAdded):
      return has(action.payload)(frame.actors)
        ? error(action.type, 'Actor is already in the scene:', action.payload)
        : flow(
          setActorStatus(action.payload, createDefaultActorStatus(action.payload))
        )(frame)

    case getType(FrameActions.intentionDeclared):
      return !has(action.payload.characterId)(frame.actors)
        ? error(action.type, 'Actor not found:', action.payload.characterId)
        : setActorStatus(action.payload.characterId, { intention: action.payload.intention })(frame)

    case getType(FrameActions.keyFrameMarked):
      return {
        ...frame,
        keyFrame: true,
      }

    case getType(FrameActions.moved):
      return !isValidPoint(action.payload.position)
        ? error(action.type, 'Invalid destination:', action.payload.position)
        : has(action.payload.characterId)(frame.actors)
          ? setActorStatus(action.payload.characterId, { position: action.payload.position })(frame)
          : error(action.type, 'Invalid actor ID:', action.payload.characterId)

    case getType(FrameActions.timeOffsetChanged):
      return action.payload < 0 ? frame : {
        ...frame,
        timeOffset: action.payload,
      }

    default:
      return frame
  }
}

// state update helpers

/** creates the initial actor status for a character */
const createDefaultActorStatus = (id: CharacterId) => ({
  id,
  intention: { type: 'idle' },
  position: { x: 0, y: 0 },
})

/** updates the actor's status in the current frame */
const setActorStatus = (
  id: CharacterId,
  status: Partial<Omit<ActorStatus, 'id'>>
) => (frame: Frame) => ({
  ...frame,
  actors: {
    ...frame.actors,
    [id]: {
      ...frame.actors[id],
      ...status,
      id,
    },
  },
})