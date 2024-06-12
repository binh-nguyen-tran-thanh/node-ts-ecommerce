import {
  omitEmptyValueFromObject,
  buildUpdateQueryFromNestedObject,
} from "./index";

describe("omitEmptyValueFromObject", () => {
  it("should return correct value", () => {
    expect(omitEmptyValueFromObject({})).toEqual({});
    expect(
      omitEmptyValueFromObject({
        a: 1,
        b: null,
        c: {},
        d: {
          e: null,
          f: {
            g: 1,
            h: null,
          },
        },
      })
    ).toEqual({
      a: 1,
      c: {},
      d: {
        f: {
          g: 1,
        },
      },
    });
  });
});

describe("buildUpdateQueryFromNestedObject", () => {
  it("should return correct value", () => {
    expect(buildUpdateQueryFromNestedObject({})).toEqual({});
    expect(
      buildUpdateQueryFromNestedObject({
        a: 1,
        b: {
          c: 2,
          d: {
            e: 3,
            f: null,
          },
        },
      })
    ).toEqual({
      a: 1,
      "b.c": 2,
      "b.d.e": 3,
    });
  });
});
