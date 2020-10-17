import { get } from 'lodash'
import { concat, drop, findLastIndex, negate, size, takeWhile } from 'lodash/fp'
import { mapAt } from '@thrashplay/fp'

import { MarkdownSection, ProcessingContext, Token, TokenProcessorFunction } from './types'
import { tokenOfType } from './utils'

import { parseHeading } from './parse-heading'
import { withRenderers } from './render'

const createSection = (): MarkdownSection => withRenderers({
  body: withRenderers({ tokens: [] }),
  children: [],
  depth: 1,
  title: undefined,
  tokens: [],
})

const addTokens = (section: MarkdownSection) => (tokens: Token[]) => ({
  ...section,
  body: {
    ...(section.body ?? []),
    tokens: concat(get(section, 'body.tokens', []), tokens),
  },
  tokens: concat(section.tokens, tokens),
})

/**
 * Adds the processing context's current section as a child to the most recently parsed section 
 * with a depth that is lower (that is, a higher level section). Does not modify any sections
 * if there is no higher-level section.
 */
const addCurrentSectionToParent = (next: TokenProcessorFunction) => (context: ProcessingContext) => {
  const depthLessThan = (section: MarkdownSection) => (item: MarkdownSection) => item.depth < section.depth
  const addChild = (child: MarkdownSection) => (parent: MarkdownSection) => ({
    ...parent,
    children: [...parent.children, child],
  })

  const { currentSection, sections } = context
  const parentIndex = findLastIndex(depthLessThan(currentSection))(sections)
  next(parentIndex === -1 ? context : {
    ...context,
    sections: mapAt(parentIndex, addChild(currentSection))(sections),
  })
}

const parseSectionBody = (next: TokenProcessorFunction) => (context: ProcessingContext) => {
  const { remainingTokens, sections } = context
  const currentSection = context.currentSection
  const bodyTokens = takeWhile(negate(tokenOfType('heading_open')))(remainingTokens)

  return next({
    ...context,
    remainingTokens: drop(size(bodyTokens))(remainingTokens),
    sections: concat(sections, addTokens(currentSection)(bodyTokens)),
  })
}

export const parseSection = (remainingTokens: Token[], sections: MarkdownSection[], next: TokenProcessorFunction) => {
  parseHeading(parseSectionBody(addCurrentSectionToParent(next)))(
    {
      currentSection: createSection(),
      remainingTokens,
      sections,
    },
  )
}