import {MapSchema} from "@colyseus/schema"
import {Token} from "@shared/types/enums";

export type TokenCountMap = MapSchema<number>;
export type TokenCount = Partial<Record<Token, number>>;

export const genCostMap = (entries: [Token, number][]) => {
  const order = Object.values(Token);
  const sortedEntries = [...entries].sort(
    ([a], [b]) => order.indexOf(a) - order.indexOf(b)
  );
  return new MapSchema<number>(new Map(sortedEntries))
}

export const getTotalTokenCount = (tokens: TokenCount) => {
  return Object.values(tokens).reduce((sum, count) => sum + (count || 0), 0);
}