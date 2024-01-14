import React, { useEffect, useRef } from "react"

export function ReactInjectedComment(props: { children: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const element = ref.current

    if (element) {
      setTimeout(() => {
        element.parentElement?.replaceChild(document.createComment(props.children), element)
      }, 1000)
    }
  }, [])

  return <span hidden ref={ref} />
}

ReactInjectedComment.displayName = "ReactInjectedComment"
