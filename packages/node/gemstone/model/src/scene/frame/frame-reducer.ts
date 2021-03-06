import { flow, has } from 'lodash/fp'
import { getType } from 'typesafe-actions'

import { CharacterId } from '../../character'
import { createReducerErrorHandler, isValidPoint } from '../../common'

import { ActorStatusBuilder, FrameBuilder } from './builders'
import { FrameEvent, FrameEvents } from './events'
import { ActorStatus, Frame } from './state'
export const frameReducer = (frame: Frame, event: FrameEvent): Frame => {
  const error = createReducerErrorHandler('frame', frame)

  switch (event.type) {
    case getType(FrameEvents.actorAdded):
      return has(event.payload)(frame.actors)
        ? error(event.type, 'Actor is already in the scene:', event.payload)
        : flow(
          setActorStatus(event.payload, createDefaultActorStatus(event.payload))
        )(frame)

    case getType(FrameEvents.actionDeclared):
      return !has(event.payload.characterId)(frame.actors)
        ? error(event.type, 'Actor not found:', event.payload.characterId)
        : setActorStatus(event.payload.characterId, { action: event.payload.action })(frame)

    case getType(FrameEvents.keyFrameMarked):
      return {
        ...frame,
        keyFrame: true,
      }

    case getType(FrameEvents.moved):
      return !isValidPoint(event.payload.position)
        ? error(event.type, 'Invalid destination:', event.payload.position)
        : has(event.payload.characterId)(frame.actors)
          ? setActorStatus(event.payload.characterId, { position: event.payload.position })(frame)
          : error(event.type, 'Invalid actor ID:', event.payload.characterId)

    case getType(FrameEvents.movementModeChanged):
      return !has(event.payload.characterId)(frame.actors)
        ? error(event.type, 'Actor not found:', event.payload.characterId)
        : setActorStatus(event.payload.characterId, { movementMode: event.payload.mode })(frame)

    case getType(FrameEvents.targetChanged):
      return !has(event.payload.characterId)(frame.actors)
        ? error(event.type, 'Actor not found:', event.payload.characterId)
        : !has(event.payload.targetId)(frame.actors)
          ? error(event.type, 'Target not found:', event.payload.targetId)
          : setActorStatus(event.payload.characterId, { target: event.payload.targetId })(frame)

    case getType(FrameEvents.targetRemoved):
      return !has(event.payload)(frame.actors)
        ? error(event.type, 'Actor not found:', event.payload)
        : setActorStatus(event.payload, { target: undefined })(frame)

    case getType(FrameEvents.timeOffsetChanged):
      return event.payload < 0 ? frame : {
        ...frame,
        timeOffset: event.payload,
      }

    default:
      return frame
  }
}

// state update helpers

/** creates the initial actor status for a character */
const createDefaultActorStatus = (id: CharacterId) => ({
  id,
  action: { type: 'idle' },
  position: { x: 0, y: 0 },
})

/** updates the actor's status in the current frame */
const setActorStatus = (
  id: CharacterId,
  status: Partial<Omit<ActorStatus, 'id'>>
) => (frame: Frame) => FrameBuilder.updateActor(id, ActorStatusBuilder.set(status))(frame)
