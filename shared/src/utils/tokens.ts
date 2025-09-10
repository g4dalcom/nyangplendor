import {Token} from "@shared/types";
import {MapSchema} from "@colyseus/schema";

export const AllTokens = Object.values(Token);
export const TokensWithoutGold = Object.values(Token).filter(token => token !== Token.GOLD);

export const genCostMap = (entries: [Token, number][]) => {
  const order = Object.values(Token);
  const sortedEntries = [...entries].sort(
    ([a], [b]) => order.indexOf(a) - order.indexOf(b)
  );
  return new MapSchema<number>(new Map(sortedEntries))
}

export const getTotalTokens = (tokens: Record<Token, number>): number => {
  return Object.values(tokens).reduce((sum, count) => sum + count, 0);
}

export const initializeTokens = (): Record<Token, number> => {
  return AllTokens.reduce((acc, token) => {
    acc[token] = 0;
    return acc;
  }, {} as Record<Token, number>);
};