import { Node, PluginItem, parse, traverse } from "@babel/core"
import MagicString from "magic-string"
import type { Plugin } from "vite"
import { injectedDataSetProperty } from "./_internal"

export type Options = {
  predicate?: (node: Node) => boolean
  plugins?: PluginItem[]
  formatDataInspectId?: (id: string) => string
}

export function inspectReact(
  options: Options = {
    plugins: [],
  },
): Plugin {
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
              return
            }

            if (node.type === "JSXElement") {
              const { start, end } = node

              // Make sure all necessary properties exist
              if (!start || !end || !node?.loc?.start) return

              const { column, line } = node.loc.start
              const finalId = options.formatDataInspectId ? options.formatDataInspectId(id) : id
              const codePath = `${finalId}:${line}:${column + 1}`
              const injectedContent = `
              <span hidden data-${injectedDataSetProperty}='${codePath}' />
              `
              str.prependLeft(start, `<>`)
              str.appendRight(end, `${injectedContent}</>`)
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
