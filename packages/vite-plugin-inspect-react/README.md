# vite-plugin-inspect-react 💞

## WHY 🙈

This plugin will wrap your react components inside your codebase during compile time with hidden span elements that do
not affect your layout. Yet, those come with unique `data-inspect-id` attributes that store the location of your React
components accordingly.

This plugin is highly inspired by another fantastic plugin so-called
[vite-plugin-react-inspector](https://github.com/sudongyuer/vite-plugin-react-inspector). The reason this plugin exists
because not all React's component libraries are built with the same structure. To achieve consistency, they sacrifice
the flexibility of the component's structure. For instance, some component libraries do not allow you to pass any props
to the root component other than their defined set of props. This plugin will help you inspect the component's structure
by wrapping a tiny hidden span around your component.

## Demo

https://github.com/willnguyen1312/namnode/assets/17794897/cbcad980-fae2-4276-89bf-54a5bb8951ab

## Installation 🚀

```bash
# pnpm
pnpm add @namnode/vite-plugin-inspect-react -D

# yarn
yarn add @namnode/vite-plugin-inspect-react -D

# npm
npm install @namnode/vite-plugin-inspect-react -D

# bun
bun install @namnode/vite-plugin-inspect-react -dev
```

## Usage 🎉

```ts
// vite.config.ts
// Please ensure this plugin comes before react plugin, otherwise it can't detect your react component inside your source code.

import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"
import { inspectReact } from "@namnode/vite-plugin-inspect-react"

export default defineConfig({
  plugins: [inspectReact(), react()],
})
```

## Options 🎨

```ts
type Options = {
  predicate?: (node: Node) => boolean
  plugins?: PluginItem[]
}

function inspectReact(option?: Options): Plugin
```

### predicate

By default, all nodes of type `JSXElement` will be inspected. However, you can pass a predicate function to filter out
the nodes that you want to ignore.

### plugins

Since the plugin is powered by `@babel/core`, you can pass any Babel plugins. For more information, please refer to
[Babel's documentation](https://babeljs.io/docs/en/plugins)
