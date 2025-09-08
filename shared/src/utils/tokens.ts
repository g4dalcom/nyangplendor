import {Token} from "@shared/types";
import {MapSchema} from "@colyseus/schema";

export const countAllTokens = (tokenMap: Map<Token, number> | MapSchema<number>): number => {
  let total = 0;

  if (tokenMap instanceof Map) {
    for (const value of tokenMap.values()) {
      total += value;
    }
  } else {
    for (const key in tokenMap) {
      if (Object.prototype.hasOwnProperty.call(tokenMap, key)) {
        const value = tokenMap.get(key);
        if (typeof value === "number") {
          total += value;
        }
      }
    }
  }
  return total;
}

/* 'enum Token' 순서대로 정렬하는 함수 */
export const sortTokens = <T>(
  source: MapSchema<T> | { [K in Token]?: T }
): { [K in Token]?: T } => {
  const order = Object.values(Token);

  const entries: [string, T][] =
    source instanceof MapSchema
      ? Array.from(source.entries())
      : Object.entries(source);

  return entries
    .sort(([a], [b]) => order.indexOf(a as Token) - order.indexOf(b as Token))
    .reduce((acc, [k, v]) => {
      acc[k as Token] = v;
      return acc;
    }, {} as { [K in Token]?: T });
};