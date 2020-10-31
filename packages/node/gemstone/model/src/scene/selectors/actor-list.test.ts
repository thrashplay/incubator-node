import { keys, omit } from 'lodash/fp'

import {
  CharacterStateFixtures,
  createStateWithDependencies,
  IntentionFixtures,
  RulesStateFixtures,
  SceneStateFixtures,
} from '../__fixtures__'
import { SceneStateContainer } from '../state'

import {
  getActor,
  getActorCollection,
  getActors,
  getActorStatusCollection,
  getCharacterIds,
} from '.'

const { GimliAndTrogdor, GimliOnly } = CharacterStateFixtures
const { Minimal } = RulesStateFixtures
const { IdleBeforeTypicalIntentions } = SceneStateFixtures

const defaultState: SceneStateContainer = createStateWithDependencies(IdleBeforeTypicalIntentions)

// this is an impossible state, but can be used to test what happens if 'frames' is somehow empty
const emptyState: SceneStateContainer = createStateWithDependencies({
  characters: [],
  frames: [],
})

const invalidState = { } as unknown as SceneStateContainer

describe('scene selectors - Actor List', () => {
  describe('getCharacterIds', () => {
    it('returns empty array if scene state is missing', () => {
      const result = getCharacterIds(invalidState)
      expect(result).toStrictEqual([])
    })

    it('returns empty array if scene has no characters', () => {
      const result = getCharacterIds(omit('characters')(emptyState) as SceneStateContainer)
      expect(result).toStrictEqual([])
    })

    it('returns correct data', () => {
      const result = getCharacterIds(defaultState)
      expect(result).toHaveLength(2)
      expect(result).toContain('gimli')
      expect(result).toContain('trogdor')
    })
  })

  describe('getActorStatusCollection', () => {
    // more cases are covered by other tests, this is just to provide visibility into if this
    // subselector is the cause of any future bugs
    it('has expected character IDs', () => {
      const result = getActorStatusCollection(defaultState)
      expect(keys(result)).toContain('gimli')
      expect(keys(result)).toContain('trogdor')
    })

    it('matches snapshot', () => {
      const result = getActorStatusCollection(defaultState)
      expect(result).toMatchSnapshot()
    })
  })

  describe('getActorCollection', () => {
    // more cases are covered by other tests, this is just to provide visibility into if this
    // subselector is the cause of any future bugs
    it('has expected character IDs', () => {
      const result = getActorCollection(defaultState)
      expect(keys(result)).toContain('gimli')
      expect(keys(result)).toContain('trogdor')
    })

    it('matches snapshot', () => {
      const result = getActorCollection(defaultState)
      expect(result).toMatchSnapshot()
    })
  })

  describe('getActors', () => {
    const stateWithoutTrogdor = ({
      characters: GimliOnly,
      rules: Minimal,
      scene: IdleBeforeTypicalIntentions,
    })

    const gimli = {
      id: 'gimli',
      name: 'Gimli, son of Glóin',
      speed: 60,
      status: {
        intention: IntentionFixtures.BefriendingElves,
        position: { x: 100, y: 100 },
      },
    }

    const trogdor = {
      id: 'trogdor',
      name: 'Trogdor, the Burninator',
      speed: 120,
      status: {
        intention: IntentionFixtures.Burninating,
        position: { x: 7, y: 7 },
      },
    }

    it('returns undefined if scene state is invalid', () => {
      const result = getActors(invalidState)
      expect(result).toStrictEqual([])
    })

    it('omits actors if character state is missing', () => {
      const result = getActors(stateWithoutTrogdor)
      expect(result).toHaveLength(1)
      expect(result).toContainEqual(gimli)
    })

    it('returns actors when all data is available', () => {
      const result = getActors(defaultState)
      expect(result).toHaveLength(2)
      expect(result).toContainEqual(gimli)
      expect(result).toContainEqual(trogdor)
    })
  })

  describe('getActor', () => {
    const stateWithoutTrogdor = ({
      characters: GimliOnly,
      rules: Minimal,
      scene: IdleBeforeTypicalIntentions,
    })

    const gimli = {
      id: 'gimli',
      name: 'Gimli, son of Glóin',
      speed: 60,
      status: {
        intention: IntentionFixtures.BefriendingElves,
        position: { x: 100, y: 100 },
      },
    }

    it('returns undefined if character ID is invalid', () => {
      const result = getActor(invalidState, { characterId: 'invalid-id' })
      expect(result).toBeUndefined()
    })

    it('returns undefined when character data missing', () => {
      const result = getActor(stateWithoutTrogdor, { characterId: 'trogdor' })
      expect(result).toBeUndefined()
    })

    describe('status data missing', () => {
      const sceneStateMissing = ({
        characters: GimliAndTrogdor,
        rules: Minimal,
      }) as unknown as SceneStateContainer

      it('returns undefined if scene state is missing', () => {
        const result = getActor(sceneStateMissing, { characterId: 'gimli' })
        expect(result).toBeUndefined()
      })

      it('returns undefined details if scene has no frames', () => {
        const result = getActor(emptyState, { characterId: 'gimli' })
        expect(result).toBeUndefined()
      })
    })

    describe('all data available', () => {
      it('returns correct data', () => {
        const result = getActor(defaultState, { characterId: 'gimli' })
        expect(result).toStrictEqual(gimli)
      })
    })
  })
})