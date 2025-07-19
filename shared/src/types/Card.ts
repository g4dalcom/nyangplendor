import { EnumValue } from "./EnumValue"
import {TokenCountMap, TokenType} from "./Token";

export const CardLevel = {
  LEVEL1: 1,
  LEVEL2: 2,
  LEVEL3: 3,
} as const;

export const CardLocation = {
  BOARD: "board",
  PLAYER: "player",
  DECK: "deck",
  RESERVE: "reserve",
} as const;

export type CardLevelType = EnumValue<typeof CardLevel>
export type CardLocationType = EnumValue<typeof CardLocation>;
export type CardCountMap = Record<string, number>;

export type DevelopmentCardType = {
  id: string,
  name: string,
  level: CardLevelType,
  token: TokenType,
  prestigePoint: number,
  cost: TokenCountMap,
  visible: boolean,
  location: CardLocationType,
}
