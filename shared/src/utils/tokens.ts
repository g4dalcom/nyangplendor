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