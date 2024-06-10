import { pick, omit } from "lodash";

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
