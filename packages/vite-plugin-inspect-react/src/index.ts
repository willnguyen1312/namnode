import { Node, parseAsync, traverse } from "@babel/core"
import MagicString from "magic-string"
import type { Plugin } from "vite"

type Options = {
  predicate?: (node: Node) => boolean
}

export function inspectReact(option: Options = {}): Plugin {
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
        })

        traverse(ast as Node, {
          enter({ node }) {
            if (option.predicate && !option.predicate(node)) {
              return
            }

            if (node.type === "JSXElement") {
              const { start, end } = node

              // Make sure all necessary properties exist
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              if (node?.openingElement?.name?.object?.name === "React" || !start || !end || !node?.loc?.start) return

              const { column, line } = node.loc.start
              const injectedContent = `<span hidden id='${id}:${line}:${column}' />`
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
