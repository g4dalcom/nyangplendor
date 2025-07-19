import { EnumValue } from "./EnumValue"
import {MapSchema} from "@colyseus/schema";

export const Token = {
  EMERALD: "Emerald",
  DIAMOND: "Diamond",
  SAPPHIRE: "Sapphire",
  ONYX: "Onyx",
  GOLD: "Gold"
} as const;

export type TokenType = EnumValue<typeof Token>
export type TokenCountMap = MapSchema<number>;