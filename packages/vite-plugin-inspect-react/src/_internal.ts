export const injectedDataSetProperty = "inspect"

export function getNearestInjectedComponentBottomUp(node: HTMLElement) {
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

    if (sib.dataset[injectedDataSetProperty]) {
      return sib
    }

    currentNode = sib
  }

  return null
}
