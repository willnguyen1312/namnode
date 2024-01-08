import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { App } from "../playground/App"
import { getNearestInjectedComponentBottomUp } from "../src/_internal"

describe("vite-plugin-inspect-react", () => {
  it("should work", () => {
    render(<App />)

    const hiThereText = screen.getByText(/hi there/i)

    const nearestInjectedNode = getNearestInjectedComponentBottomUp(hiThereText)

    if (!nearestInjectedNode) {
      throw new Error("No injected node found")
    }

    const expectedHiThereTextPosition = "playground/App.tsx:7:7"
    expect(nearestInjectedNode.id).toBe(expectedHiThereTextPosition)
  })
})
