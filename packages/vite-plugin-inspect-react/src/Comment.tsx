import React, { useEffect, useRef } from "react"

export function Comment(props: { children: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const element = ref.current

    if (element) {
      element.outerHTML = `<!-- ${props.children} -->`
    }
  }, [])

  return <span hidden ref={ref} />
}
