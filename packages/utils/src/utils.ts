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
