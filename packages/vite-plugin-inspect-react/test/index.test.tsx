import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { App } from "../playground/App"

describe("vite-plugin-inspect-react", () => {
  it("should work", () => {
    const { container } = render(<App />)

    expect(container).toMatchInlineSnapshot(`
  <div>
    <span
      hidden=""
      id="/Users/namnguyen/vn/github/namnode/packages/vite-plugin-inspect-react/test/index.test.tsx:7:33"
    />
    <span
      hidden=""
      id="/Users/namnguyen/vn/github/namnode/packages/vite-plugin-inspect-react/playground/App.tsx:6:6"
    />
    <h1>
      Hi there 💞
    </h1>
  </div>
`)
  })
})
