import { slugifyWithCounter } from '@sindresorhus/slugify'
import * as acorn from 'acorn'
import { toString } from 'mdast-util-to-string'
import { mdxAnnotations } from 'mdx-annotations'
import { getHighlighter } from 'shiki'
import { visit } from 'unist-util-visit'

function rehypeParseCodeBlocks() {
  return (tree) => {
    visit(tree, 'element', (node, _nodeIndex, parentNode) => {
      if (node.tagName === 'code' && node.properties.className) {
        parentNode.properties.language = node.properties.className[0]?.replace(
          /^language-/,
          '',
        )
      }
    })
  }
}

let highlighter

function rehypeShiki() {
  return async (tree) => {
    highlighter =
      highlighter ??
      (await getHighlighter({
        theme: 'css-variables',
        langs: [
          'javascript',
          'typescript',
          'python',
          'ruby',
          'php',
          'go',
          'bash',
          'json',
        ],
      }))

    visit(tree, 'element', (node) => {
      if (node.tagName === 'pre' && node.children[0]?.tagName === 'code') {
        let codeNode = node.children[0]
        let textNode = codeNode.children[0]

        node.properties.code = textNode.value

        if (node.properties.language) {
          try {
            let tokens = highlighter.codeToThemedTokens(
              textNode.value,
              node.properties.language,
            )

            textNode.value = shikiTokensToHtml(tokens)

            codeNode.properties['data-highlighted'] = true
          } catch (e) {
            // Language not supported, leave as plain text
          }
        }
      }
    })
  }
}

function shikiTokensToHtml(lines) {
  let html = ''

  for (let line of lines) {
    for (let token of line) {
      let style = token.color ? `color: ${token.color}` : ''
      html += style
        ? `<span style="${style}">${escapeHtml(token.content)}</span>`
        : escapeHtml(token.content)
    }
    html += '\n'
  }

  return html
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function rehypeSlugify() {
  return (tree) => {
    let slugify = slugifyWithCounter()
    visit(tree, 'element', (node) => {
      if (node.tagName === 'h2' && !node.properties.id) {
        node.properties.id = slugify(toString(node))
      }
    })
  }
}

function rehypeAddMDXExports(getExports) {
  return (tree) => {
    let exports = Object.entries(getExports(tree))

    for (let [name, value] of exports) {
      for (let node of tree.children) {
        if (
          node.type === 'mdxjsEsm' &&
          new RegExp(`export\\s+const\\s+${name}\\s*=`).test(node.value)
        ) {
          return
        }
      }

      let exportStr = `export const ${name} = ${value}`

      tree.children.push({
        type: 'mdxjsEsm',
        value: exportStr,
        data: {
          estree: acorn.parse(exportStr, {
            sourceType: 'module',
            ecmaVersion: 'latest',
          }),
        },
      })
    }
  }
}

function getSections(tree) {
  let sections = []

  for (let node of tree.children) {
    if (node.type === 'element' && node.tagName === 'h2') {
      sections.push(`{
        title: ${JSON.stringify(toString(node))},
        id: ${JSON.stringify(node.properties.id)},
        ...${JSON.stringify(node.properties.annotation ?? {})}
      }`)
    }
  }

  return sections
}

export const rehypePlugins = [
  mdxAnnotations.rehype,
  rehypeParseCodeBlocks,
  rehypeShiki,
  rehypeSlugify,
  [
    rehypeAddMDXExports,
    (tree) => ({
      sections: `[${getSections(tree).join(',')}]`,
    }),
  ],
]
