import { Node, PluginItem, parseAsync, traverse } from "@babel/core"
import MagicString from "magic-string"
import type { Plugin } from "vite"
import { getNearestInjectedNodeBottomUp, injectedScript, magicComponentName } from "./_internal"

export { getNearestInjectedNodeBottomUp }

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

    transformIndexHtml: {
      enforce: "pre",
      transform(html) {
        // Inject the script to the head
        html = html.replace("</head>", `<script>${injectedScript}</script></head>`)
        return html
      },
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
              const injectedContent = `
              <${magicComponentName} value='${finalId}:${line}:${column + 1}' />
              `
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
