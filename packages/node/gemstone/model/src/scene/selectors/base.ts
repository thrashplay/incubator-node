import { CharacterId } from '../../character'
import { createParameterSelector, Point } from '../../common'
import { SceneStateContainer } from '../state'

export interface SceneSelectorParameters {
  characterId?: CharacterId

  /** if true, a request for a non-existent frame tag will fallback to the current frame */
  fallback?: boolean

  /** name of the tagged frame to use for querying; defaults to the current frame if omitted */
  frameTag?: string

  /** position to use for spatial selectors */
  position?: Point
}

export const getCharacterIdParam = createParameterSelector((params?: SceneSelectorParameters) => params?.characterId)
export const getFallbackParam = createParameterSelector((params?: SceneSelectorParameters) => params?.fallback ?? false)
export const getFrameTagParam = createParameterSelector((params?: SceneSelectorParameters) => params?.frameTag)
export const getPositionParam = createParameterSelector((params?: SceneSelectorParameters) => params?.position)

export const getState = (state: SceneStateContainer) => state

/** scene selectors */
export const getScene = (state: SceneStateContainer) => state.scene ?? { }
