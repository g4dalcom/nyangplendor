import { EnumValue } from "./EnumValue"

export const Action = {
  BRING_ANOTHER_TOKENS: 0,
  BRING_SAME_TOKENS: 1,
  RESERVE_CARD: 2,
  PURCHASE_CARD: 3
} as const

export type ActionType = EnumValue<typeof Action>
