import { Node, PluginItem, parse, traverse } from "@babel/core"
import type { JSXIdentifier, JSXMemberExpression } from "@babel/types"
import MagicString from "magic-string"
import type { Plugin } from "vite"
import { propName } from "./_internal"

type InspecType = "devtool" | "dom"

export type Options = {
  predicate?: (node: Node) => boolean
  plugins?: PluginItem[]
  formatDataInspectId?: (id: string) => string
  type?: InspecType
  propName?: string
}

// Credit to https://github.com/sudongyuer/vite-plugin-react-inspector/blob/1f4284ebae2ca7001aff5be4619cd53be49ed862/packages/vite-plugin-react-inspector/src/utils/index.ts#L1-L9
function parseJSXIdentifier(name: JSXIdentifier | JSXMemberExpression): string {
  if (name.type === "JSXIdentifier") {
    return name.name
  }

  return `${parseJSXIdentifier(name.object)}.${parseJSXIdentifier(name.property)}`
}

export function inspectReact(options: Options): Plugin {
  if (!options.type) {
    options.type = "dom"
  }

  if (!options.plugins) {
    options.plugins = []
  }

  if (!options.propName) {
    options.propName = propName
  }

  return {
    name: "vite-plugin-inspect-react",

    enforce: "pre",

    apply: "serve",

    config: () => {
      return {
        optimizeDeps: {
          include: ["react-dom"],
        },
      }
    },

    transform: (code, id) => {
      if (id.endsWith(".tsx")) {
        const str = new MagicString(code)

        // const isCommentFile = id.includes("Comment")
        // if (!isCommentFile) {
        //   str.appendLeft(0, `import { Comment } from './Comment'\n`)
        // }

        if (options.type === "dom") {
          str.appendLeft(
            0,
            `import { ReactInjectedComment } from '@namnode/vite-plugin-inspect-react/ReactInjectedComment'\n`,
          )
        }

        const ast = parse(code, {
          configFile: false,
          filename: id,
          ast: true,
          presets: ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"],
          plugins: options.plugins,
        })

        traverse(ast as Node, {
          enter({ node }) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const isReact = node?.openingElement?.name?.object?.name === "React"
            const customSkip = options.predicate && !options.predicate(node)
            if (customSkip || isReact) {
              // if (customSkip || isReact || isCommentFile) {
              return
            }

            if (node.type === "JSXElement") {
              const { start, end } = node

              // Make sure all necessary properties exist
              if (!start || !end || !node?.loc?.start) return

              const { column, line } = node.loc.start
              const finalId = options.formatDataInspectId ? options.formatDataInspectId(id) : id
              const codePath = `${finalId}:${line}:${column + 1}`

              if (options.type === "dom") {
                const injectedContent = `
                <ReactInjectedComment>${codePath}</ReactInjectedComment>
                `
                str.prependLeft(start, `<>`)
                str.appendRight(end, `${injectedContent}</>`)
              }

              if (options.type === "devtool") {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const toInsertPosition = start + parseJSXIdentifier(node.openingElement.name as any).length + 1
                const content = ` ${options.propName}='${codePath}'`
                str.appendLeft(toInsertPosition, content)
              }
            }
          },
        })

        return {
          code: str.toString(),
          map: str.generateMap({
            source: id,
            includeContent: true,
          }),
        }
      }
    },
  }
}
