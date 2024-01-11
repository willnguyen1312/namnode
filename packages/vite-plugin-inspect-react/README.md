# vite-plugin-inspect-react 💞

## WHY 🙈

This plugin will inject special `span` nodes next to your react components inside your codebase during compile time.
Yet, those come with a unique `data-inspect` property that stores the location of your React components accordingly.

This plugin is highly inspired by another fantastic plugin so-called
[vite-plugin-react-inspector](https://github.com/sudongyuer/vite-plugin-react-inspector). The reason this plugin exists
because not all React's component libraries are built with extensibility in mind. To achieve certain consistency, they
sacrifice the flexibility of the component's structure. For instance, some component libraries do not allow you to pass
any props other than their pre-defined set of props. Therefore,
[dataset property](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset) injection is not an option
anymore. This plugin helps to overcome that limitation 🎉

## Demo

https://github.com/willnguyen1312/namnode/assets/17794897/6c48b24c-70b5-4ddb-a00f-3a1a5a27eff6

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

```ts
// Retrieve code path of component which render element in the DOM
import { getCodePathFromElement } from "@namnode/vite-plugin-inspect-react/utils"

const codePath = getCodePathFromElement(element)
```

## Options 🎨

```ts
type Options = {
  predicate?: (node: Node) => boolean
  plugins?: PluginItem[]
  formatDataInspectId?: (id: string) => string
}

function inspectReact(option?: Options): Plugin
```

### predicate

By default, all nodes of type `JSXElement` will be inspected. However, you can pass a predicate function to filter out
the nodes that you want to ignore.

### plugins

Since the plugin is powered by `@babel/core`, you can pass any Babel plugins. For more information, please refer to
[Babel's documentation](https://babeljs.io/docs/en/plugins).

### formatDataInspectId

By default, the plugin will generate a unique `data-inspect-id` for each component with an absolute path. However, you
can pass a function to format the `data-inspect-id` to your liking.

## Development 🧑‍💻

### Playground

#### From vite-plugin-inspect-react folder

```bash
pnpm dev
```

#### From root folder

```bash
pnpm start-inspect-react
```
