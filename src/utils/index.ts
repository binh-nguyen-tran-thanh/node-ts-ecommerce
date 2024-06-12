import {
  pick,
  omit,
  cloneDeep,
  isEmpty,
  isArray,
  concat,
  get,
  isNull,
} from "lodash";

export function transferToViewObject<T extends object | null | undefined>(
  rawData: T,
  fields: string[]
) {
  const escapedData = omit(rawData, ["__v", "_id"]);
  return pick(escapedData, fields);
}

export function parseToInt(value: string, fallbackValue = 0) {
  if (!value) return fallbackValue;
  const intValue = parseInt(value, 10);
  if (Number.isNaN(intValue)) return fallbackValue;

  return intValue;
}

export function parseArrayToSelectObject(selectArray: string[]) {
  return Object.fromEntries(selectArray.map((key) => [key, 1]));
}

export function parseArrayToUnSelectObject(unSelectArray: string[]) {
  return Object.fromEntries(unSelectArray.map((key) => [key, 0]));
}

export function omitEmptyValueFromObject(object: { [key in string]: any }) {
  if (isEmpty(object)) return {};
  let result = cloneDeep(object);
  Object.keys(result).map((key) => {
    const value = result[key];
    if (typeof value === "object" && !isArray(value) && !isNull(value)) {
      result[key] = omitEmptyValueFromObject(value);
    } else if (!value) {
      delete result[key];
    }
  });

  return result;
}

export function buildUpdateQueryFromNestedObject(
  object: { [key in string]: any },
  previousKey: string[] = []
) {
  const objectWithoutNullValue = omitEmptyValueFromObject(object);
  if (isEmpty(objectWithoutNullValue)) return {};

  let result: { [key in string]: any } = {};

  Object.keys(objectWithoutNullValue).map((key) => {
    const value = get(objectWithoutNullValue, key);
    if (typeof value === "object" && !isArray(value)) {
      const response = buildUpdateQueryFromNestedObject(
        value,
        concat(previousKey, key)
      );
      if (!response) return;
      Object.keys(response).map((nestedKey) => {
        result[nestedKey] = get(response, nestedKey);
      });
    } else {
      const path = concat(previousKey, key).join(".");
      result[path] = get(objectWithoutNullValue, key);
    }
  });

  return result;
}
