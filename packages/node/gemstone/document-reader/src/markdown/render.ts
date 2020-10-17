import htmlToText from 'html-to-text'
import { isEmpty } from 'lodash/fp'
import MarkdownIt from 'markdown-it'

const markdown = new MarkdownIt()
const renderer = markdown.renderer

import { MarkdownContentBlock } from './types'

export const renderHtml = (content: MarkdownContentBlock) => {
  return isEmpty(content?.tokens) ? '' : renderer.render(content.tokens, {}, {}).trim()
}

export const renderText = (content: MarkdownContentBlock) => {
  const html = renderHtml(content)

  const htmlToTextOptions = {
    uppercaseHeadings: false,
    wordwrap: null,
  }

  return htmlToText.fromString(html, htmlToTextOptions)
}

export const getHtmlRenderer = (content: MarkdownContentBlock) => renderHtml(content)
export const getTextRenderer = (content: MarkdownContentBlock) => renderText(content)

type ContentBlockWithoutRenders = Omit<MarkdownContentBlock, 'getHtml' | 'getText'>
export const withRenderers = <T extends ContentBlockWithoutRenders>(content: T) => ({
  ...content,
  getHtml: function () {
    return renderHtml(this)
  },  
  getText: function () {
    return renderText(this)
  },
})