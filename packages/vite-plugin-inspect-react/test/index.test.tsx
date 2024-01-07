import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { App } from "../playground/App"

function traverseBottomUp(node: HTMLElement, predicate: (node: HTMLElement) => HTMLElement | null) {
  let currentNode: Node | null = node
  while (currentNode) {
    const found = predicate(currentNode as HTMLElement)
    if (found) {
      return found
    }
    currentNode = currentNode.parentElement
  }

  return null
}

describe("vite-plugin-inspect-react", () => {
  it("should work", () => {
    render(<App />)

    const hiThereText = screen.getByText(/hi there/i)

    const nearestInjectedNode = traverseBottomUp(hiThereText, (node) => {
      // const isCurrentNode
      // return !!node.hidden && node.tagName === "SPAN"

      let currentNode = node

      while (currentNode.previousSibling) {
        const sib = currentNode.previousSibling as HTMLElement

        if (sib.hasAttribute("hidden") && sib.tagName === "SPAN") {
          return sib
        }

        currentNode = sib
      }

      return null
    })

    if (!nearestInjectedNode) {
      throw new Error("No injected node found")
    }

    const h1Position = `playground/App.tsx:4:7`
    expect(nearestInjectedNode.id).toContain(h1Position)
  })
})
