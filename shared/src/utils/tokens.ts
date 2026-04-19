import {Token} from "@shared/types";
import {ArraySchema, MapSchema} from "@colyseus/schema";
import {DevelopmentCard} from "@shared/models/colyseus/DevelopmentCard";

export const AllTokens = Object.values(Token);
export const TokensWithoutGold = Object.values(Token).filter(token => token !== Token.GOLD);

export const genCostMap = (entries: [Token, number][]) => {
  const order = Object.values(Token);
  const sortedEntries = [...entries].sort(
    ([a], [b]) => order.indexOf(a) - order.indexOf(b)
  );
  return new MapSchema<number>(new Map(sortedEntries))
}

/* Token의 총 개수 */
export const getTotalTokens = (tokens: Record<Token, number>): number => {
  return Object.values(tokens).reduce((sum, count) => sum + count, 0);
}

/* 보유한 카드의 보너스 토큰 정보 */
export const getCardBonus = (cards: DevelopmentCard[] | ArraySchema<DevelopmentCard>): Record<Token, number> => {
  const cardList = Array.isArray(cards) ? cards : (cards as any).toArray ? (cards as any).toArray() : cards;
  return (cardList as DevelopmentCard[]).reduce((acc, card) => {
    const bonusToken = card.token;
    acc[bonusToken] += 1;
    return acc;
  }, initializeTokens());
}

/* (구매하려는 카드의 토큰 가격 - 보유한 카드 보너스), 실제 토큰으로 지불해야 하는 토큰 코스트 */
export const getRequiredCardCost = (cost: MapSchema<number> | Record<Token, number>, cardBonuses: Record<Token, number>) => {
  const actualCost = initializeTokens();
  const costRecord = convertMapSchemaToRecord(cost);
  for (const [token, count] of Object.entries(costRecord)) {
    const key = token as Token;
    actualCost[key] = Math.max(0, count - (cardBonuses[key] || 0));
  }
  return actualCost;
}

/* 모든 토큰을 0으로 초기화 */
export const initializeTokens = (): Record<Token, number> => {
  return AllTokens.reduce((acc, token) => {
    acc[token] = 0;
    return acc;
  }, {} as Record<Token, number>);
};

/* colyseus MapSchema를 Record 객체로 컨버팅. MapSchema 객체가 모든 Token을 갖고 있는 게 보장되어야 함. */
export const convertMapSchemaToRecord = (mapSchema: MapSchema<number> | Record<Token, number>) => {
  if (!(mapSchema instanceof MapSchema)) {
    return mapSchema;
  }
  const tokens = initializeTokens();
  if (mapSchema.size > 0) {
    for (const [token, count] of mapSchema.entries()) {
      tokens[token as Token] = count;
    }
  }
  return tokens;
}

/* 카드를 구매할 때 부족한 토큰 정보를 반환. Gold 토큰을 고려하여 계산함. */
export const getPurchaseShortage = (
  cost: MapSchema<number> | Record<Token, number>,
  playerTokens: Record<Token, number>,
  playerCardBonuses: Record<Token, number>
): { isAffordable: boolean } => {
  const actualCost = getRequiredCardCost(convertMapSchemaToRecord(cost), playerCardBonuses);
  let totalShortage = 0;
  const goldAvailable = playerTokens[Token.GOLD] || 0;

  for (const [token, count] of Object.entries(actualCost)) {
    const t = token as Token;
    if (t === Token.GOLD) continue;
    const playerTokenCount = playerTokens[t] || 0;
    if (playerTokenCount < count) {
      totalShortage += count - playerTokenCount;
    }
  }

  return { isAffordable: totalShortage <= goldAvailable };
}