export const injectedDataSetProperty = "inspect"

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
  while (currentNode.previousSibling) {
    const sib = currentNode.previousSibling as HTMLElement

    if (sib instanceof Comment) {
      return sib.nodeValue
    }

    currentNode = sib
  }

  return null
}

function switchSpanToHtmlComment() {
  const allSpan = document.querySelectorAll(`span[data-${injectedDataSetProperty}]`)

  allSpan.forEach((span) => {
    const comment = document.createComment(span.id)
    span.replaceWith(comment)
  })
}

export function watchInspectedElements() {
  switchSpanToHtmlComment()
  const observer = new MutationObserver(switchSpanToHtmlComment)

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })

  return () => {
    observer.disconnect()
  }
}
