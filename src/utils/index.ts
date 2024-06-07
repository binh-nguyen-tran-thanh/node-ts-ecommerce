import { pick } from "lodash";

export function transferToViewObject<T>(rawData: T, fields: string[]) {
  return pick(rawData, fields);
}
