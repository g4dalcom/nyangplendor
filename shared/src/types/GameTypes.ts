import {MapSchema} from "@colyseus/schema"
import {Token} from "@shared/types/enums";

export type TokenCountMap = MapSchema<number>;
export type TokenCount = Partial<Record<Token, number>>;

export const genCostMap = (entries: [string, number][]) => {
  return new MapSchema<number>(new Map(entries))
}

export const getTotalTokenCount = (tokens: TokenCount) => {
  return Object.values(tokens).reduce((sum, count) => sum + (count || 0), 0);
}