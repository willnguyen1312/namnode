export function getCodePathFromElement(node: HTMLElement): string {
  let currentNode: Node | null = node
  while (currentNode) {
    const found = getNearestInjectedNodeFromCurrentNode(currentNode as HTMLElement)
    if (found) {
      return found
    }
    currentNode = currentNode.parentElement
  }

  return ""
}

export function getNearestInjectedNodeFromCurrentNode(node: HTMLElement) {
  let currentNode = node
  while (currentNode.nextSibling) {
    const sib = currentNode.nextSibling as HTMLElement

    if (sib instanceof Comment) {
      return sib.textContent
    }

    currentNode = sib
  }

  return null
}

export const propName = "a-code-path"
