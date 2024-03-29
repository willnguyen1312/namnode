# vite-plugin-inspect-react 💞

## WHY 🙈

This plugin will inject special `comment` nodes next to your react components inside your codebase during compile time.
Yet, those come with unique content that stores the location of your React components accordingly

This plugin is highly inspired by another fantastic plugin so-called
[vite-plugin-react-inspector](https://github.com/sudongyuer/vite-plugin-react-inspector). The reason this plugin exists
because not all React's component libraries are built with extensibility in mind. To achieve certain consistency, they
sacrifice the flexibility of the component's structure. For instance, some component libraries do not allow you to pass
any props other than their pre-defined set of props. Therefore,
[dataset property](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset) injection is not an option
anymore. This plugin helps to overcome that limitation 🎉

React's dev tool does have a feature to inspect the component's location, but it is not as accurate at scale in my
experience. Therefore, I recommend you try out this plugin only when the React dev tool is not enough for your use case.

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
  base?: string
  type?: "devtool" | "dom"
  propName?: string
}

function inspectReact(option?: Options): Plugin
```

### predicate

By default, all nodes of type `JSXElement` will be inspected. However, you can pass a predicate function to filter out
the nodes that you want to ignore.

### plugins

Since the plugin is powered by `@babel/core`, you can pass any Babel plugins. For more information, please refer to
[Babel's documentation](https://babeljs.io/docs/en/plugins).

### base

By default, the plugin will return the absolute path. However, you can override this behavior by passing a base, which
will be used to resolve the relative path.

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
