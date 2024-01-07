# vite-plugin-inspect-react 💞

## WHY 🙈

This plugin will wrap your react component inside your codebase with a hidden span that does not affect your layout.
Yet, it comes with an ID that stores the location of the next sibling of the span inside your code.

This plugin is highly inspired by another fantastic plugin so-called
[vite-plugin-react-inspector](https://github.com/sudongyuer/vite-plugin-react-inspector). The reason this plugin exists
because not all React's component libraries are built with the same structure. To achieve consistency, they sacrifice
the flexibility of the component's structure. For instance, some component libraries do not allow you to pass any props
to the root component other than their defined set of props. This plugin will help you inspect the component's structure
by wrapping a tiny hidden span around your component.
