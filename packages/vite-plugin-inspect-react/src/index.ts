import { Node, PluginItem, parseAsync, traverse } from "@babel/core"
import MagicString from "magic-string"
import type { Plugin } from "vite"

type Options = {
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

    transform: async (code, id) => {
      if (id.endsWith(".tsx")) {
        const str = new MagicString(code)
        const ast = await parseAsync(code, {
          configFile: false,
          filename: id,
          ast: true,
          presets: ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"],
          plugins: options.plugins,
        })

        traverse(ast as Node, {
          enter({ node }) {
            if (options.predicate && !options.predicate(node)) {
              return
            }

            if (node.type === "JSXElement") {
              const { start, end } = node

              // Make sure all necessary properties exist
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              if (node?.openingElement?.name?.object?.name === "React" || !start || !end || !node?.loc?.start) return

              const { column, line } = node.loc.start
              const finalId = options.formatDataInspectId ? options.formatDataInspectId(id) : id
              const injectedContent = `<span hidden data-inspect-id='${finalId}:${line}:${column + 1}' />`
              str.prependLeft(start, `<>${injectedContent}`)
              str.appendRight(end, `</>`)
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
