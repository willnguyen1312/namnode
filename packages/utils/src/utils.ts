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
