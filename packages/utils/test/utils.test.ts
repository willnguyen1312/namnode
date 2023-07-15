import { faker } from "@faker-js/faker"
import fc from "fast-check"
import { it } from "vitest"
import { clamp, makeMaybeCallFunction, overrideObjectProps } from "../src"

describe("clamp functions", () => {
  it("should work for value in between inclusively", () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (first, second) => {
        const [min, max] = [Math.min(first, second), Math.max(first, second)]
        const value = faker.number.int({ min, max })
        expect(clamp(value, min, max)).toBe(value)
      }),
    )
  })

  it("should work for value under bound", () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (first, second) => {
        const [min, max] = [Math.min(first, second), Math.max(first, second)]
        const value = faker.number.int({
          min: Number.MIN_SAFE_INTEGER,
          max: min - 1,
        })
        expect(clamp(value, min, max)).toBe(min)
      }),
    )
  })

  it("should work for value upper bound", () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (first, second) => {
        const [min, max] = [Math.min(first, second), Math.max(first, second)]
        const value = faker.number.int({
          min: max + 1,
          max: Number.MAX_SAFE_INTEGER,
        })
        expect(clamp(value, min, max)).toBe(max)
      }),
    )
  })
})

describe("makeMaybeCallFunction function", () => {
  it("should call function based on predicate return value", () => {
    fc.assert(
      fc.property(fc.boolean(), (value) => {
        const mockFn = vi.fn()
        makeMaybeCallFunction(() => value, mockFn)(void 0)
        expect(mockFn).toHaveBeenCalledTimes(value ? 1 : 0)
      }),
    )
  })
})

describe("overrideObjectProps function", () => {
  it("should override properties in the target object with properties from the override object", () => {
    const target = { a: faker.number.int(), b: faker.number.int() }
    const override = { b: faker.number.int() }

    overrideObjectProps(target, override)
    expect(target).toEqual({ a: target.a, b: override.b })
  })

  it("should add new properties to the target object", () => {
    const target = { a: faker.number.int(), b: faker.number.int() }
    const override = { c: faker.number.int(), d: faker.number.int() }

    overrideObjectProps(target, override)
    expect(target).toEqual({ a: target.a, b: target.b, c: override.c, d: override.d })
  })

  it("should not do anything on empty override object", () => {
    const target = { a: faker.number.int(), b: faker.number.int() }
    const override = {}

    overrideObjectProps(target, override)
    expect(target).toEqual(target)
  })
})
