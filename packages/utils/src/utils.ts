export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

// Credit: https://github.com/kentor/flush-promises
export const flushPromises = () => new Promise((resolve) => setTimeout(resolve))

export function makeMaybeCallFunction<T>(predicateFn: () => boolean, fn: (arg: T) => void) {
  return (arg: T) => {
    if (predicateFn()) {
      fn(arg)
    }
  }
}

export const sleep = (millisecond: number) => new Promise((resolve) => setTimeout(resolve, millisecond))

const createLoadScript = () => {
  const scriptSet = new Set<string>()

  async function loadScript(url: string) {
    if (scriptSet.has(url)) {
      return Promise.resolve()
    }

    return new Promise<void>(function (resolve, reject) {
      const scriptElement = document.createElement("script")
      scriptElement.src = url

      scriptElement.onload = function () {
        scriptSet.add(url)
        resolve()
      }

      scriptElement.onerror = function () {
        reject(new Error(`Failed to load script: ${url}`))
      }

      document.head.appendChild(scriptElement)
    })
  }

  return loadScript
}

export const loadScript = createLoadScript()

/**
 *
 * This function is used to override the target object with the source object. It is useful to overcome TypeScript conservative type checking approach
 *
 * Reference - https://www.reddit.com/r/typescript/comments/yin5xa/comment/iums6vy/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button
 */
export const overrideObjectProps = (target: Record<string, unknown>, override: Record<string, unknown>) => {
  for (const key in override) {
    target[key] = override[key]
  }
}
