import React, { useEffect, useState } from "react"
import { getCodePathFromElement } from "../src/_internal"

export function App() {
  return (
    <>
      <h1>Hi there 💞</h1>
      <Inspector />
    </>
  )
}

function Inspector() {
  const [isInspecting, setIsInspecting] = useState(false)
  const [codePath, setCodePath] = useState("")

  useEffect(() => {
    if (!isInspecting) return

    let currentElement: HTMLElement | null = null

    const handlerPointerOver = (e: PointerEvent) => {
      const element = e.target as HTMLElement
      currentElement = element
      element.style.outline = "2px solid red"
    }

    const handlerPointerLeave = () => {
      currentElement?.style.removeProperty("outline")
    }

    const handlerPointerDown = (e: PointerEvent) => {
      const element = e.target as HTMLElement
      setIsInspecting(false)
      element.style.removeProperty("outline")

      setCodePath(getCodePathFromElement(element))
    }

    window.addEventListener("pointerover", handlerPointerOver, true)
    window.addEventListener("pointerout", handlerPointerLeave, true)
    window.addEventListener("pointerdown", handlerPointerDown, true)

    return () => {
      window.removeEventListener("pointerover", handlerPointerOver, true)
      window.removeEventListener("pointerout", handlerPointerLeave, true)
      window.removeEventListener("pointerdown", handlerPointerDown, true)
    }
  }, [isInspecting])

  return (
    <>
      <button
        onClick={() => {
          setIsInspecting(!isInspecting)
        }}
      >
        {isInspecting ? "Inspecting" : "Inspect"}
      </button>
      <p>Code path: {codePath}</p>
    </>
  )
}
