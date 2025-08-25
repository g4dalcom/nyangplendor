import {MapSchema, Schema, type} from "@colyseus/schema"
import {nanoid} from "nanoid"
import {CardLevel, CardLocation, genCostMap, Token} from "@shared/types"

type CardType = {
  name: string
  level: CardLevel
  token: Token
  prestigePoint: number
  cost: MapSchema<number>
}

export class DevelopmentCard extends Schema {
  //
  @type("string") id: string
  @type("string") name: string
  @type("uint8") level: CardLevel
  @type("string") token: Token
  @type("uint8") prestigePoint: number
  @type({ map: "uint8" }) cost = new MapSchema<number>()
  @type("boolean") visible: boolean
  @type("string") location: CardLocation
  @type("string") ownerId?: string

  constructor(
    name: string,
    level: CardLevel,
    token: Token,
    prestigePoint: number,
    cost: MapSchema<number>
  ) {
    super()
    this.id = nanoid()
    this.name = name
    this.level = level
    this.token = token
    this.prestigePoint = prestigePoint
    this.cost = cost
    this.visible = false
    this.location = CardLocation.DECK
  }
}

const classify = (cards: CardType[]): DevelopmentCard[] => {
  return cards.map(card => new DevelopmentCard(card.name, card.level, card.token, card.prestigePoint, card.cost))
}

const level1Cards: CardType[] = [
  { name: "DA1", level: CardLevel.LEVEL1, token: Token.DIAMOND, prestigePoint: 0, cost: genCostMap([[Token.RUBY, 2], [Token.ONYX, 1]]) },
  { name: "DB1", level: CardLevel.LEVEL1, token: Token.DIAMOND, prestigePoint: 0, cost: genCostMap([[Token.SAPPHIRE, 3]]) },
  { name: "DC1", level: CardLevel.LEVEL1, token: Token.DIAMOND, prestigePoint: 0, cost: genCostMap([[Token.RUBY, 1], [Token.SAPPHIRE, 1], [Token.DIAMOND, 1], [Token.ONYX, 1]]) },
  { name: "DD1", level: CardLevel.LEVEL1, token: Token.DIAMOND, prestigePoint: 0, cost: genCostMap([[Token.SAPPHIRE, 2], [Token.ONYX, 2]]) },
  { name: "DE1", level: CardLevel.LEVEL1, token: Token.DIAMOND, prestigePoint: 0, cost: genCostMap([[Token.EMERALD, 2], [Token.RUBY, 1], [Token.SAPPHIRE, 2], [Token.ONYX, 1]]) },
  { name: "DF1", level: CardLevel.LEVEL1, token: Token.DIAMOND, prestigePoint: 0, cost: genCostMap([[Token.SAPPHIRE, 2], [Token.EMERALD, 2], [Token.ONYX, 1]]) },
  { name: "DG1", level: CardLevel.LEVEL1, token: Token.DIAMOND, prestigePoint: 0, cost: genCostMap([[Token.DIAMOND, 3], [Token.SAPPHIRE, 1], [Token.ONYX, 1]]) },
  { name: "DH1", level: CardLevel.LEVEL1, token: Token.DIAMOND, prestigePoint: 1, cost: genCostMap([[Token.EMERALD, 4]]) },

  { name: "SA1", level: CardLevel.LEVEL1, token: Token.SAPPHIRE, prestigePoint: 0, cost: genCostMap([[Token.ONYX, 2], [Token.DIAMOND, 1]]) },
  { name: "SB1", level: CardLevel.LEVEL1, token: Token.SAPPHIRE, prestigePoint: 0, cost: genCostMap([[Token.ONYX, 3]]) },
  { name: "SC1", level: CardLevel.LEVEL1, token: Token.SAPPHIRE, prestigePoint: 0, cost: genCostMap([[Token.RUBY, 1], [Token.EMERALD, 1], [Token.DIAMOND, 1], [Token.ONYX, 1]]) },
  { name: "SD1", level: CardLevel.LEVEL1, token: Token.SAPPHIRE, prestigePoint: 0, cost: genCostMap([[Token.EMERALD, 2], [Token.ONYX, 2]]) },
  { name: "SE1", level: CardLevel.LEVEL1, token: Token.SAPPHIRE, prestigePoint: 0, cost: genCostMap([[Token.RUBY, 2], [Token.EMERALD, 1], [Token.DIAMOND, 1], [Token.ONYX, 1]]) },
  { name: "SF1", level: CardLevel.LEVEL1, token: Token.SAPPHIRE, prestigePoint: 0, cost: genCostMap([[Token.RUBY, 2], [Token.EMERALD, 2], [Token.DIAMOND, 1]]) },
  { name: "SG1", level: CardLevel.LEVEL1, token: Token.SAPPHIRE, prestigePoint: 0, cost: genCostMap([[Token.EMERALD, 3], [Token.RUBY, 1], [Token.SAPPHIRE, 3]]) },
  { name: "SH1", level: CardLevel.LEVEL1, token: Token.SAPPHIRE, prestigePoint: 1, cost: genCostMap([[Token.RUBY, 4]]) },

  { name: "EA1", level: CardLevel.LEVEL1, token: Token.EMERALD, prestigePoint: 0, cost: genCostMap([[Token.DIAMOND, 2], [Token.SAPPHIRE, 1]]) },
  { name: "EB1", level: CardLevel.LEVEL1, token: Token.EMERALD, prestigePoint: 0, cost: genCostMap([[Token.RUBY, 3]]) },
  { name: "EC1", level: CardLevel.LEVEL1, token: Token.EMERALD, prestigePoint: 0, cost: genCostMap([[Token.RUBY, 1], [Token.SAPPHIRE, 1], [Token.DIAMOND, 1], [Token.ONYX, 1]]) },
  { name: "ED1", level: CardLevel.LEVEL1, token: Token.EMERALD, prestigePoint: 0, cost: genCostMap([[Token.RUBY, 2], [Token.SAPPHIRE, 2]]) },
  { name: "EE1", level: CardLevel.LEVEL1, token: Token.EMERALD, prestigePoint: 0, cost: genCostMap([[Token.ONYX, 2], [Token.RUBY, 1], [Token.SAPPHIRE, 1], [Token.DIAMOND, 1]]) },
  { name: "EF1", level: CardLevel.LEVEL1, token: Token.EMERALD, prestigePoint: 0, cost: genCostMap([[Token.RUBY, 2], [Token.ONYX, 2], [Token.SAPPHIRE, 1]]) },
  { name: "EG1", level: CardLevel.LEVEL1, token: Token.EMERALD, prestigePoint: 0, cost: genCostMap([[Token.EMERALD, 3], [Token.SAPPHIRE, 1], [Token.DIAMOND, 1]]) },
  { name: "EH1", level: CardLevel.LEVEL1, token: Token.EMERALD, prestigePoint: 1, cost: genCostMap([[Token.ONYX, 4]]) },

  { name: "RA1", level: CardLevel.LEVEL1, token: Token.RUBY, prestigePoint: 0, cost: genCostMap([[Token.SAPPHIRE, 2], [Token.EMERALD, 1]]) },
  { name: "RB1", level: CardLevel.LEVEL1, token: Token.RUBY, prestigePoint: 0, cost: genCostMap([[Token.DIAMOND, 3]]) },
  { name: "RC1", level: CardLevel.LEVEL1, token: Token.RUBY, prestigePoint: 0, cost: genCostMap([[Token.SAPPHIRE, 1], [Token.EMERALD, 1], [Token.DIAMOND, 1], [Token.ONYX, 1]]) },
  { name: "RD1", level: CardLevel.LEVEL1, token: Token.RUBY, prestigePoint: 0, cost: genCostMap([[Token.RUBY, 2], [Token.DIAMOND, 2]]) },
  { name: "RE1", level: CardLevel.LEVEL1, token: Token.RUBY, prestigePoint: 0, cost: genCostMap([[Token.DIAMOND, 2], [Token.SAPPHIRE, 1], [Token.EMERALD, 1], [Token.ONYX, 1]]) },
  { name: "RF1", level: CardLevel.LEVEL1, token: Token.RUBY, prestigePoint: 0, cost: genCostMap([[Token.DIAMOND, 2], [Token.ONYX, 2], [Token.EMERALD, 1]]) },
  { name: "RG1", level: CardLevel.LEVEL1, token: Token.RUBY, prestigePoint: 0, cost: genCostMap([[Token.ONYX, 3], [Token.RUBY, 1], [Token.DIAMOND, 1]]) },
  { name: "RH1", level: CardLevel.LEVEL1, token: Token.RUBY, prestigePoint: 1, cost: genCostMap([[Token.DIAMOND, 4]]) },

  { name: "OA1", level: CardLevel.LEVEL1, token: Token.ONYX, prestigePoint: 0, cost: genCostMap([[Token.EMERALD, 2], [Token.RUBY, 1]]) },
  { name: "OB1", level: CardLevel.LEVEL1, token: Token.ONYX, prestigePoint: 0, cost: genCostMap([[Token.EMERALD, 3]]) },
  { name: "OC1", level: CardLevel.LEVEL1, token: Token.ONYX, prestigePoint: 0, cost: genCostMap([[Token.RUBY, 1], [Token.SAPPHIRE, 1], [Token.EMERALD, 1], [Token.DIAMOND, 1]]) },
  { name: "OD1", level: CardLevel.LEVEL1, token: Token.ONYX, prestigePoint: 0, cost: genCostMap([[Token.EMERALD, 2], [Token.DIAMOND, 2]]) },
  { name: "OE1", level: CardLevel.LEVEL1, token: Token.ONYX, prestigePoint: 0, cost: genCostMap([[Token.SAPPHIRE, 2], [Token.EMERALD, 2], [Token.RUBY, 1], [Token.DIAMOND, 1]]) },
  { name: "OF1", level: CardLevel.LEVEL1, token: Token.ONYX, prestigePoint: 0, cost: genCostMap([[Token.SAPPHIRE, 2], [Token.DIAMOND, 2], [Token.RUBY, 1]]) },
  { name: "OG1", level: CardLevel.LEVEL1, token: Token.ONYX, prestigePoint: 0, cost: genCostMap([[Token.RUBY, 3], [Token.EMERALD, 1], [Token.ONYX, 1]]) },
  { name: "OH1", level: CardLevel.LEVEL1, token: Token.ONYX, prestigePoint: 1, cost: genCostMap([[Token.SAPPHIRE, 4]]) },
]

const level2Cards: CardType[] = [
  { name: "DA2", level: CardLevel.LEVEL2, token: Token.DIAMOND, prestigePoint: 1, cost: genCostMap([[Token.EMERALD, 3], [Token.RUBY, 2], [Token.ONYX, 2]]) },
  { name: "DB2", level: CardLevel.LEVEL2, token: Token.DIAMOND, prestigePoint: 1, cost: genCostMap([[Token.RUBY, 3], [Token.SAPPHIRE, 3], [Token.DIAMOND, 2]]) },
  { name: "DC2", level: CardLevel.LEVEL2, token: Token.DIAMOND, prestigePoint: 2, cost: genCostMap([[Token.RUBY, 5]]) },
  { name: "DD2", level: CardLevel.LEVEL2, token: Token.DIAMOND, prestigePoint: 2, cost: genCostMap([[Token.RUBY, 4], [Token.ONYX, 2], [Token.EMERALD, 1]]) },
  { name: "DE2", level: CardLevel.LEVEL2, token: Token.DIAMOND, prestigePoint: 2, cost: genCostMap([[Token.RUBY, 5], [Token.ONYX, 3]]) },
  { name: "DF2", level: CardLevel.LEVEL2, token: Token.DIAMOND, prestigePoint: 3, cost: genCostMap([[Token.DIAMOND, 6]]) },

  { name: "SA2", level: CardLevel.LEVEL2, token: Token.SAPPHIRE, prestigePoint: 1, cost: genCostMap([[Token.RUBY, 3], [Token.SAPPHIRE, 2], [Token.EMERALD, 2]]) },
  { name: "SB2", level: CardLevel.LEVEL2, token: Token.SAPPHIRE, prestigePoint: 1, cost: genCostMap([[Token.ONYX, 3], [Token.EMERALD, 3], [Token.SAPPHIRE, 2]]) },
  { name: "SC2", level: CardLevel.LEVEL2, token: Token.SAPPHIRE, prestigePoint: 2, cost: genCostMap([[Token.SAPPHIRE, 5]]) },
  { name: "SD2", level: CardLevel.LEVEL2, token: Token.SAPPHIRE, prestigePoint: 2, cost: genCostMap([[Token.ONYX, 4], [Token.DIAMOND, 2], [Token.RUBY, 1]]) },
  { name: "SE2", level: CardLevel.LEVEL2, token: Token.SAPPHIRE, prestigePoint: 2, cost: genCostMap([[Token.DIAMOND, 5], [Token.SAPPHIRE, 3]]) },
  { name: "SF2", level: CardLevel.LEVEL2, token: Token.SAPPHIRE, prestigePoint: 3, cost: genCostMap([[Token.SAPPHIRE, 6]]) },

  { name: "EA2", level: CardLevel.LEVEL2, token: Token.EMERALD, prestigePoint: 1, cost: genCostMap([[Token.SAPPHIRE, 3], [Token.DIAMOND, 2], [Token.ONYX, 2]]) },
  { name: "EB2", level: CardLevel.LEVEL2, token: Token.EMERALD, prestigePoint: 1, cost: genCostMap([[Token.RUBY, 3], [Token.DIAMOND, 3], [Token.EMERALD, 2]]) },
  { name: "EC2", level: CardLevel.LEVEL2, token: Token.EMERALD, prestigePoint: 2, cost: genCostMap([[Token.EMERALD, 5]]) },
  { name: "ED2", level: CardLevel.LEVEL2, token: Token.EMERALD, prestigePoint: 2, cost: genCostMap([[Token.DIAMOND, 4], [Token.SAPPHIRE, 2], [Token.ONYX, 1]]) },
  { name: "EE2", level: CardLevel.LEVEL2, token: Token.EMERALD, prestigePoint: 2, cost: genCostMap([[Token.SAPPHIRE, 5], [Token.EMERALD, 3]]) },
  { name: "EF2", level: CardLevel.LEVEL2, token: Token.EMERALD, prestigePoint: 3, cost: genCostMap([[Token.EMERALD, 6]]) },

  { name: "RA2", level: CardLevel.LEVEL2, token: Token.RUBY, prestigePoint: 1, cost: genCostMap([[Token.ONYX, 3], [Token.RUBY, 2], [Token.DIAMOND, 2]]) },
  { name: "RB2", level: CardLevel.LEVEL2, token: Token.RUBY, prestigePoint: 1, cost: genCostMap([[Token.EMERALD, 3], [Token.ONYX, 3], [Token.RUBY, 2]]) },
  { name: "RC2", level: CardLevel.LEVEL2, token: Token.RUBY, prestigePoint: 2, cost: genCostMap([[Token.ONYX, 5]]) },
  { name: "RD2", level: CardLevel.LEVEL2, token: Token.RUBY, prestigePoint: 2, cost: genCostMap([[Token.SAPPHIRE, 4], [Token.EMERALD, 2], [Token.DIAMOND, 1]]) },
  { name: "RE2", level: CardLevel.LEVEL2, token: Token.RUBY, prestigePoint: 2, cost: genCostMap([[Token.ONYX, 5], [Token.DIAMOND, 3]]) },
  { name: "RF2", level: CardLevel.LEVEL2, token: Token.RUBY, prestigePoint: 3, cost: genCostMap([[Token.RUBY, 6]]) },

  { name: "OA2", level: CardLevel.LEVEL2, token: Token.ONYX, prestigePoint: 1, cost: genCostMap([[Token.DIAMOND, 3], [Token.SAPPHIRE, 2], [Token.EMERALD, 2]]) },
  { name: "OB2", level: CardLevel.LEVEL2, token: Token.ONYX, prestigePoint: 1, cost: genCostMap([[Token.DIAMOND, 3], [Token.EMERALD, 3], [Token.ONYX, 2]]) },
  { name: "OC2", level: CardLevel.LEVEL2, token: Token.ONYX, prestigePoint: 2, cost: genCostMap([[Token.DIAMOND, 5]]) },
  { name: "OD2", level: CardLevel.LEVEL2, token: Token.ONYX, prestigePoint: 2, cost: genCostMap([[Token.EMERALD, 4], [Token.RUBY, 2], [Token.SAPPHIRE, 1]]) },
  { name: "OE2", level: CardLevel.LEVEL2, token: Token.ONYX, prestigePoint: 2, cost: genCostMap([[Token.EMERALD, 5], [Token.RUBY, 3]]) },
  { name: "OF2", level: CardLevel.LEVEL2, token: Token.ONYX, prestigePoint: 3, cost: genCostMap([[Token.ONYX, 6]]) },
]

const level3Cards: CardType[] = [
  { name: "DA3", level: CardLevel.LEVEL3, token: Token.DIAMOND, prestigePoint: 3, cost: genCostMap([[Token.RUBY, 5], [Token.SAPPHIRE, 3], [Token.EMERALD, 3], [Token.ONYX, 3]]) },
  { name: "DB3", level: CardLevel.LEVEL3, token: Token.DIAMOND, prestigePoint: 4, cost: genCostMap([[Token.ONYX, 7]]) },
  { name: "DC3", level: CardLevel.LEVEL3, token: Token.DIAMOND, prestigePoint: 4, cost: genCostMap([[Token.ONYX, 6], [Token.RUBY, 3], [Token.DIAMOND, 3]]) },
  { name: "DD3", level: CardLevel.LEVEL3, token: Token.DIAMOND, prestigePoint: 5, cost: genCostMap([[Token.ONYX, 7], [Token.DIAMOND, 3]]) },

  { name: "SA3", level: CardLevel.LEVEL3, token: Token.SAPPHIRE, prestigePoint: 3, cost: genCostMap([[Token.ONYX, 5], [Token.RUBY, 3], [Token.EMERALD, 3], [Token.DIAMOND, 3]]) },
  { name: "SB3", level: CardLevel.LEVEL3, token: Token.SAPPHIRE, prestigePoint: 4, cost: genCostMap([[Token.DIAMOND, 7]]) },
  { name: "SC3", level: CardLevel.LEVEL3, token: Token.SAPPHIRE, prestigePoint: 4, cost: genCostMap([[Token.DIAMOND, 6], [Token.SAPPHIRE, 3], [Token.ONYX, 3]]) },
  { name: "SD3", level: CardLevel.LEVEL3, token: Token.SAPPHIRE, prestigePoint: 5, cost: genCostMap([[Token.DIAMOND, 7], [Token.SAPPHIRE, 3]]) },

  { name: "EA3", level: CardLevel.LEVEL3, token: Token.EMERALD, prestigePoint: 3, cost: genCostMap([[Token.DIAMOND, 5], [Token.RUBY, 3], [Token.SAPPHIRE, 3], [Token.ONYX, 3]]) },
  { name: "EB3", level: CardLevel.LEVEL3, token: Token.EMERALD, prestigePoint: 4, cost: genCostMap([[Token.SAPPHIRE, 7]]) },
  { name: "EC3", level: CardLevel.LEVEL3, token: Token.EMERALD, prestigePoint: 4, cost: genCostMap([[Token.SAPPHIRE, 6], [Token.EMERALD, 3], [Token.DIAMOND, 3]]) },
  { name: "ED3", level: CardLevel.LEVEL3, token: Token.EMERALD, prestigePoint: 5, cost: genCostMap([[Token.SAPPHIRE, 7], [Token.EMERALD, 3]]) },

  { name: "RA3", level: CardLevel.LEVEL3, token: Token.RUBY, prestigePoint: 3, cost: genCostMap([[Token.SAPPHIRE, 5], [Token.EMERALD, 3], [Token.DIAMOND, 3], [Token.ONYX, 3]]) },
  { name: "RB3", level: CardLevel.LEVEL3, token: Token.RUBY, prestigePoint: 4, cost: genCostMap([[Token.EMERALD, 7]]) },
  { name: "RC3", level: CardLevel.LEVEL3, token: Token.RUBY, prestigePoint: 4, cost: genCostMap([[Token.EMERALD, 6], [Token.RUBY, 3], [Token.SAPPHIRE, 3]]) },
  { name: "RD3", level: CardLevel.LEVEL3, token: Token.RUBY, prestigePoint: 5, cost: genCostMap([[Token.EMERALD, 7], [Token.RUBY, 3]]) },

  { name: "OA3", level: CardLevel.LEVEL3, token: Token.ONYX, prestigePoint: 3, cost: genCostMap([[Token.EMERALD, 5], [Token.RUBY, 3], [Token.SAPPHIRE, 3], [Token.DIAMOND, 3]]) },
  { name: "OB3", level: CardLevel.LEVEL3, token: Token.ONYX, prestigePoint: 4, cost: genCostMap([[Token.RUBY, 7]]) },
  { name: "OC3", level: CardLevel.LEVEL3, token: Token.ONYX, prestigePoint: 4, cost: genCostMap([[Token.RUBY, 6], [Token.EMERALD, 3], [Token.ONYX, 3]]) },
  { name: "OD3", level: CardLevel.LEVEL3, token: Token.ONYX, prestigePoint: 5, cost: genCostMap([[Token.RUBY, 7], [Token.ONYX, 3]]) },
]

export const developmentCardClasses: Record<CardLevel, DevelopmentCard[]> = {
  [CardLevel.LEVEL1]: classify(level1Cards),
  [CardLevel.LEVEL2]: classify(level2Cards),
  [CardLevel.LEVEL3]: classify(level3Cards),
}
