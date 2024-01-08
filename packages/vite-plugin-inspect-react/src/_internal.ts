export const magicComponentName = "inspect-react"

export const injectedScript = `
class InspectReactComponent extends HTMLElement {
  constructor() {
    super();
  }
}

customElements.define(${magicComponentName}, InspectReactComponent);
`
