export const magicComponentName = "inspect-react"

export const injectedScript = `
class InspectReactComponent extends HTMLElement {
  constructor() {
    super();
  }
}

customElements.define('${magicComponentName}', InspectReactComponent);
`

export function getNearestInjectedNodeBottomUp(node: HTMLElement) {
  let currentNode: Node | null = node
  while (currentNode) {
    const found = getNearestInjectedNodeFromCurrentNode(currentNode as HTMLElement)
    if (found) {
      return found
    }
    currentNode = currentNode.parentElement
  }

  return null
}

export function getNearestInjectedNodeFromCurrentNode(node: HTMLElement) {
  let currentNode = node
  while (currentNode.previousSibling) {
    const sib = currentNode.previousSibling as HTMLElement

    if (sib.nodeName.toLocaleLowerCase() === magicComponentName) {
      return sib
    }

    currentNode = sib
  }

  return null
}
