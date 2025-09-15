import {MapSchema, Schema, type} from "@colyseus/schema"
import {nanoid} from "nanoid"
import {CardLevel, DevelopmentCardImageUrl, Token} from "@shared/types"
import {genCostMap} from "@shared/utils";

type CardType = {
  name: string
  level: CardLevel
  token: Token
  prestigePoint: number
  cost: MapSchema<number>
  imageUrl?: string
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
  @type("string") imageUrl: string

  constructor(
    name: string,
    level: CardLevel,
    token: Token,
    prestigePoint: number,
    cost: MapSchema<number>,
    imageUrl: string = '/developmentCards/level1/DA1.webp',
  ) {
    super()
    this.id = nanoid()
    this.name = name
    this.level = level
    this.token = token
    this.prestigePoint = prestigePoint
    this.cost = cost
    this.visible = false
    this.imageUrl = imageUrl
  }
}

const classify = (cards: CardType[]): DevelopmentCard[] => {
  return cards.map(card => new DevelopmentCard(
    card.name,
    card.level,
    card.token,
    card.prestigePoint,
    new MapSchema<number>(Object.fromEntries(card.cost.entries())),
    card.imageUrl
  ))
}

const level1Cards: CardType[] = [
  {
    name: "DA1",
    level: CardLevel.LEVEL1,
    token: Token.DIAMOND,
    prestigePoint: 0,
    cost: genCostMap([[Token.RUBY, 2], [Token.ONYX, 1]]),
    imageUrl: DevelopmentCardImageUrl.DA1
  },
  {
    name: "DB1",
    level: CardLevel.LEVEL1,
    token: Token.DIAMOND,
    prestigePoint: 0,
    cost: genCostMap([[Token.SAPPHIRE, 3]]),
    imageUrl: DevelopmentCardImageUrl.DB1
  },
  {
    name: "DC1",
    level: CardLevel.LEVEL1,
    token: Token.DIAMOND,
    prestigePoint: 0,
    cost: genCostMap([[Token.RUBY, 1], [Token.SAPPHIRE, 1], [Token.DIAMOND, 1], [Token.ONYX, 1]]),
    imageUrl: DevelopmentCardImageUrl.DC1
  },
  {
    name: "DD1",
    level: CardLevel.LEVEL1,
    token: Token.DIAMOND,
    prestigePoint: 0,
    cost: genCostMap([[Token.SAPPHIRE, 2], [Token.ONYX, 2]]),
    imageUrl: DevelopmentCardImageUrl.DD1
  },
  {
    name: "DE1",
    level: CardLevel.LEVEL1,
    token: Token.DIAMOND,
    prestigePoint: 0,
    cost: genCostMap([[Token.EMERALD, 2], [Token.RUBY, 1], [Token.SAPPHIRE, 2], [Token.ONYX, 1]]),
    imageUrl: DevelopmentCardImageUrl.DE1
  },
  {
    name: "DF1",
    level: CardLevel.LEVEL1,
    token: Token.DIAMOND,
    prestigePoint: 0,
    cost: genCostMap([[Token.SAPPHIRE, 2], [Token.EMERALD, 2], [Token.ONYX, 1]]),
    imageUrl: DevelopmentCardImageUrl.DF1
  },
  {
    name: "DG1",
    level: CardLevel.LEVEL1,
    token: Token.DIAMOND,
    prestigePoint: 0,
    cost: genCostMap([[Token.DIAMOND, 3], [Token.SAPPHIRE, 1], [Token.ONYX, 1]]),
    imageUrl: DevelopmentCardImageUrl.DG1
  },
  {
    name: "DH1",
    level: CardLevel.LEVEL1,
    token: Token.DIAMOND,
    prestigePoint: 1,
    cost: genCostMap([[Token.EMERALD, 4]]),
    imageUrl: DevelopmentCardImageUrl.DH1
  },

  {
    name: "SA1",
    level: CardLevel.LEVEL1,
    token: Token.SAPPHIRE,
    prestigePoint: 0,
    cost: genCostMap([[Token.ONYX, 2], [Token.DIAMOND, 1]]),
    imageUrl: DevelopmentCardImageUrl.SA1
  },
  {
    name: "SB1",
    level: CardLevel.LEVEL1,
    token: Token.SAPPHIRE,
    prestigePoint: 0,
    cost: genCostMap([[Token.ONYX, 3]]),
    imageUrl: DevelopmentCardImageUrl.SB1
  },
  {
    name: "SC1",
    level: CardLevel.LEVEL1,
    token: Token.SAPPHIRE,
    prestigePoint: 0,
    cost: genCostMap([[Token.RUBY, 1], [Token.EMERALD, 1], [Token.DIAMOND, 1], [Token.ONYX, 1]]),
    imageUrl: DevelopmentCardImageUrl.SC1
  },
  {
    name: "SD1",
    level: CardLevel.LEVEL1,
    token: Token.SAPPHIRE,
    prestigePoint: 0,
    cost: genCostMap([[Token.EMERALD, 2], [Token.ONYX, 2]]),
    imageUrl: DevelopmentCardImageUrl.SD1
  },
  {
    name: "SE1",
    level: CardLevel.LEVEL1,
    token: Token.SAPPHIRE,
    prestigePoint: 0,
    cost: genCostMap([[Token.RUBY, 2], [Token.EMERALD, 1], [Token.DIAMOND, 1], [Token.ONYX, 1]]),
    imageUrl: DevelopmentCardImageUrl.SE1
  },
  {
    name: "SF1",
    level: CardLevel.LEVEL1,
    token: Token.SAPPHIRE,
    prestigePoint: 0,
    cost: genCostMap([[Token.RUBY, 2], [Token.EMERALD, 2], [Token.DIAMOND, 1]]),
    imageUrl: DevelopmentCardImageUrl.SF1
  },
  {
    name: "SG1",
    level: CardLevel.LEVEL1,
    token: Token.SAPPHIRE,
    prestigePoint: 0,
    cost: genCostMap([[Token.EMERALD, 3], [Token.RUBY, 1], [Token.SAPPHIRE, 3]]),
    imageUrl: DevelopmentCardImageUrl.SG1
  },
  {
    name: "SH1",
    level: CardLevel.LEVEL1,
    token: Token.SAPPHIRE,
    prestigePoint: 1,
    cost: genCostMap([[Token.RUBY, 4]]),
    imageUrl: DevelopmentCardImageUrl.SH1
  },

  {
    name: "EA1",
    level: CardLevel.LEVEL1,
    token: Token.EMERALD,
    prestigePoint: 0,
    cost: genCostMap([[Token.DIAMOND, 2], [Token.SAPPHIRE, 1]]),
    imageUrl: DevelopmentCardImageUrl.EA1
  },
  {
    name: "EB1",
    level: CardLevel.LEVEL1,
    token: Token.EMERALD,
    prestigePoint: 0,
    cost: genCostMap([[Token.RUBY, 3]]),
    imageUrl: DevelopmentCardImageUrl.EB1
  },
  {
    name: "EC1",
    level: CardLevel.LEVEL1,
    token: Token.EMERALD,
    prestigePoint: 0,
    cost: genCostMap([[Token.RUBY, 1], [Token.SAPPHIRE, 1], [Token.DIAMOND, 1], [Token.ONYX, 1]]),
    imageUrl: DevelopmentCardImageUrl.EC1
  },
  {
    name: "ED1",
    level: CardLevel.LEVEL1,
    token: Token.EMERALD,
    prestigePoint: 0,
    cost: genCostMap([[Token.RUBY, 2], [Token.SAPPHIRE, 2]]),
    imageUrl: DevelopmentCardImageUrl.ED1
  },
  {
    name: "EE1",
    level: CardLevel.LEVEL1,
    token: Token.EMERALD,
    prestigePoint: 0,
    cost: genCostMap([[Token.ONYX, 2], [Token.RUBY, 1], [Token.SAPPHIRE, 1], [Token.DIAMOND, 1]]),
    imageUrl: DevelopmentCardImageUrl.EE1
  },
  {
    name: "EF1",
    level: CardLevel.LEVEL1,
    token: Token.EMERALD,
    prestigePoint: 0,
    cost: genCostMap([[Token.RUBY, 2], [Token.ONYX, 2], [Token.SAPPHIRE, 1]]),
    imageUrl: DevelopmentCardImageUrl.EF1
  },
  {
    name: "EG1",
    level: CardLevel.LEVEL1,
    token: Token.EMERALD,
    prestigePoint: 0,
    cost: genCostMap([[Token.EMERALD, 3], [Token.SAPPHIRE, 1], [Token.DIAMOND, 1]]),
    imageUrl: DevelopmentCardImageUrl.EG1
  },
  {
    name: "EH1",
    level: CardLevel.LEVEL1,
    token: Token.EMERALD,
    prestigePoint: 1,
    cost: genCostMap([[Token.ONYX, 4]]),
    imageUrl: DevelopmentCardImageUrl.EH1
  },

  {
    name: "RA1",
    level: CardLevel.LEVEL1,
    token: Token.RUBY,
    prestigePoint: 0,
    cost: genCostMap([[Token.SAPPHIRE, 2], [Token.EMERALD, 1]]),
    imageUrl: DevelopmentCardImageUrl.RA1
  },
  {
    name: "RB1",
    level: CardLevel.LEVEL1,
    token: Token.RUBY,
    prestigePoint: 0,
    cost: genCostMap([[Token.DIAMOND, 3]]),
    imageUrl: DevelopmentCardImageUrl.RB1
  },
  {
    name: "RC1",
    level: CardLevel.LEVEL1,
    token: Token.RUBY,
    prestigePoint: 0,
    cost: genCostMap([[Token.SAPPHIRE, 1], [Token.EMERALD, 1], [Token.DIAMOND, 1], [Token.ONYX, 1]]),
    imageUrl: DevelopmentCardImageUrl.RC1
  },
  {
    name: "RD1",
    level: CardLevel.LEVEL1,
    token: Token.RUBY,
    prestigePoint: 0,
    cost: genCostMap([[Token.RUBY, 2], [Token.DIAMOND, 2]]),
    imageUrl: DevelopmentCardImageUrl.RD1
  },
  {
    name: "RE1",
    level: CardLevel.LEVEL1,
    token: Token.RUBY,
    prestigePoint: 0,
    cost: genCostMap([[Token.DIAMOND, 2], [Token.SAPPHIRE, 1], [Token.EMERALD, 1], [Token.ONYX, 1]]),
    imageUrl: DevelopmentCardImageUrl.RE1
  },
  {
    name: "RF1",
    level: CardLevel.LEVEL1,
    token: Token.RUBY,
    prestigePoint: 0,
    cost: genCostMap([[Token.DIAMOND, 2], [Token.ONYX, 2], [Token.EMERALD, 1]]),
    imageUrl: DevelopmentCardImageUrl.RF1
  },
  {
    name: "RG1",
    level: CardLevel.LEVEL1,
    token: Token.RUBY,
    prestigePoint: 0,
    cost: genCostMap([[Token.ONYX, 3], [Token.RUBY, 1], [Token.DIAMOND, 1]]),
    imageUrl: DevelopmentCardImageUrl.RG1
  },
  {
    name: "RH1",
    level: CardLevel.LEVEL1,
    token: Token.RUBY,
    prestigePoint: 1,
    cost: genCostMap([[Token.DIAMOND, 4]]),
    imageUrl: DevelopmentCardImageUrl.RH1
  },

  {
    name: "OA1",
    level: CardLevel.LEVEL1,
    token: Token.ONYX,
    prestigePoint: 0,
    cost: genCostMap([[Token.EMERALD, 2], [Token.RUBY, 1]]),
    imageUrl: DevelopmentCardImageUrl.OA1
  },
  {
    name: "OB1",
    level: CardLevel.LEVEL1,
    token: Token.ONYX,
    prestigePoint: 0,
    cost: genCostMap([[Token.EMERALD, 3]]),
    imageUrl: DevelopmentCardImageUrl.OB1
  },
  {
    name: "OC1",
    level: CardLevel.LEVEL1,
    token: Token.ONYX,
    prestigePoint: 0,
    cost: genCostMap([[Token.RUBY, 1], [Token.SAPPHIRE, 1], [Token.EMERALD, 1], [Token.DIAMOND, 1]]),
    imageUrl: DevelopmentCardImageUrl.OC1
  },
  {
    name: "OD1",
    level: CardLevel.LEVEL1,
    token: Token.ONYX,
    prestigePoint: 0,
    cost: genCostMap([[Token.EMERALD, 2], [Token.DIAMOND, 2]]),
    imageUrl: DevelopmentCardImageUrl.OD1
  },
  {
    name: "OE1",
    level: CardLevel.LEVEL1,
    token: Token.ONYX,
    prestigePoint: 0,
    cost: genCostMap([[Token.SAPPHIRE, 2], [Token.EMERALD, 2], [Token.RUBY, 1], [Token.DIAMOND, 1]]),
    imageUrl: DevelopmentCardImageUrl.OE1
  },
  {
    name: "OF1",
    level: CardLevel.LEVEL1,
    token: Token.ONYX,
    prestigePoint: 0,
    cost: genCostMap([[Token.SAPPHIRE, 2], [Token.DIAMOND, 2], [Token.RUBY, 1]]),
    imageUrl: DevelopmentCardImageUrl.OF1
  },
  {
    name: "OG1",
    level: CardLevel.LEVEL1,
    token: Token.ONYX,
    prestigePoint: 0,
    cost: genCostMap([[Token.RUBY, 3], [Token.EMERALD, 1], [Token.ONYX, 1]]),
    imageUrl: DevelopmentCardImageUrl.OG1
  },
  {
    name: "OH1",
    level: CardLevel.LEVEL1,
    token: Token.ONYX,
    prestigePoint: 1,
    cost: genCostMap([[Token.SAPPHIRE, 4]]),
    imageUrl: DevelopmentCardImageUrl.OH1
  },
]

const level2Cards: CardType[] = [
  {
    name: "DA2",
    level: CardLevel.LEVEL2,
    token: Token.DIAMOND,
    prestigePoint: 1,
    cost: genCostMap([[Token.EMERALD, 3], [Token.RUBY, 2], [Token.ONYX, 2]]),
    imageUrl: DevelopmentCardImageUrl.DA2
  },
  {
    name: "DB2",
    level: CardLevel.LEVEL2,
    token: Token.DIAMOND,
    prestigePoint: 1,
    cost: genCostMap([[Token.RUBY, 3], [Token.SAPPHIRE, 3], [Token.DIAMOND, 2]]),
    imageUrl: DevelopmentCardImageUrl.DB2
  },
  {
    name: "DC2",
    level: CardLevel.LEVEL2,
    token: Token.DIAMOND,
    prestigePoint: 2,
    cost: genCostMap([[Token.RUBY, 5]]),
    imageUrl: DevelopmentCardImageUrl.DC2
  },
  {
    name: "DD2",
    level: CardLevel.LEVEL2,
    token: Token.DIAMOND,
    prestigePoint: 2,
    cost: genCostMap([[Token.RUBY, 4], [Token.ONYX, 2], [Token.EMERALD, 1]]),
    imageUrl: DevelopmentCardImageUrl.DD2
  },
  {
    name: "DE2",
    level: CardLevel.LEVEL2,
    token: Token.DIAMOND,
    prestigePoint: 2,
    cost: genCostMap([[Token.RUBY, 5], [Token.ONYX, 3]]),
    imageUrl: DevelopmentCardImageUrl.DE2
  },
  {
    name: "DF2",
    level: CardLevel.LEVEL2,
    token: Token.DIAMOND,
    prestigePoint: 3,
    cost: genCostMap([[Token.DIAMOND, 6]]),
    imageUrl: DevelopmentCardImageUrl.DF2
  },

  {
    name: "SA2",
    level: CardLevel.LEVEL2,
    token: Token.SAPPHIRE,
    prestigePoint: 1,
    cost: genCostMap([[Token.RUBY, 3], [Token.SAPPHIRE, 2], [Token.EMERALD, 2]]),
    imageUrl: DevelopmentCardImageUrl.SA2
  },
  {
    name: "SB2",
    level: CardLevel.LEVEL2,
    token: Token.SAPPHIRE,
    prestigePoint: 1,
    cost: genCostMap([[Token.ONYX, 3], [Token.EMERALD, 3], [Token.SAPPHIRE, 2]]),
    imageUrl: DevelopmentCardImageUrl.SB2
  },
  {
    name: "SC2",
    level: CardLevel.LEVEL2,
    token: Token.SAPPHIRE,
    prestigePoint: 2,
    cost: genCostMap([[Token.SAPPHIRE, 5]]),
    imageUrl: DevelopmentCardImageUrl.SC2
  },
  {
    name: "SD2",
    level: CardLevel.LEVEL2,
    token: Token.SAPPHIRE,
    prestigePoint: 2,
    cost: genCostMap([[Token.ONYX, 4], [Token.DIAMOND, 2], [Token.RUBY, 1]]),
    imageUrl: DevelopmentCardImageUrl.SD2
  },
  {
    name: "SE2",
    level: CardLevel.LEVEL2,
    token: Token.SAPPHIRE,
    prestigePoint: 2,
    cost: genCostMap([[Token.DIAMOND, 5], [Token.SAPPHIRE, 3]]),
    imageUrl: DevelopmentCardImageUrl.SE2
  },
  {
    name: "SF2",
    level: CardLevel.LEVEL2,
    token: Token.SAPPHIRE,
    prestigePoint: 3,
    cost: genCostMap([[Token.SAPPHIRE, 6]]),
    imageUrl: DevelopmentCardImageUrl.SF2
  },

  {
    name: "EA2",
    level: CardLevel.LEVEL2,
    token: Token.EMERALD,
    prestigePoint: 1,
    cost: genCostMap([[Token.SAPPHIRE, 3], [Token.DIAMOND, 2], [Token.ONYX, 2]]),
    imageUrl: DevelopmentCardImageUrl.EA2
  },
  {
    name: "EB2",
    level: CardLevel.LEVEL2,
    token: Token.EMERALD,
    prestigePoint: 1,
    cost: genCostMap([[Token.RUBY, 3], [Token.DIAMOND, 3], [Token.EMERALD, 2]]),
    imageUrl: DevelopmentCardImageUrl.EB2
  },
  {
    name: "EC2",
    level: CardLevel.LEVEL2,
    token: Token.EMERALD,
    prestigePoint: 2,
    cost: genCostMap([[Token.EMERALD, 5]]),
    imageUrl: DevelopmentCardImageUrl.EC2
  },
  {
    name: "ED2",
    level: CardLevel.LEVEL2,
    token: Token.EMERALD,
    prestigePoint: 2,
    cost: genCostMap([[Token.DIAMOND, 4], [Token.SAPPHIRE, 2], [Token.ONYX, 1]]),
    imageUrl: DevelopmentCardImageUrl.ED2
  },
  {
    name: "EE2",
    level: CardLevel.LEVEL2,
    token: Token.EMERALD,
    prestigePoint: 2,
    cost: genCostMap([[Token.SAPPHIRE, 5], [Token.EMERALD, 3]]),
    imageUrl: DevelopmentCardImageUrl.EE2
  },
  {
    name: "EF2",
    level: CardLevel.LEVEL2,
    token: Token.EMERALD,
    prestigePoint: 3,
    cost: genCostMap([[Token.EMERALD, 6]]),
    imageUrl: DevelopmentCardImageUrl.EF2
  },

  {
    name: "RA2",
    level: CardLevel.LEVEL2,
    token: Token.RUBY,
    prestigePoint: 1,
    cost: genCostMap([[Token.ONYX, 3], [Token.RUBY, 2], [Token.DIAMOND, 2]]),
    imageUrl: DevelopmentCardImageUrl.RA2
  },
  {
    name: "RB2",
    level: CardLevel.LEVEL2,
    token: Token.RUBY,
    prestigePoint: 1,
    cost: genCostMap([[Token.EMERALD, 3], [Token.ONYX, 3], [Token.RUBY, 2]]),
    imageUrl: DevelopmentCardImageUrl.RB2
  },
  {
    name: "RC2",
    level: CardLevel.LEVEL2,
    token: Token.RUBY,
    prestigePoint: 2,
    cost: genCostMap([[Token.ONYX, 5]]),
    imageUrl: DevelopmentCardImageUrl.RC2
  },
  {
    name: "RD2",
    level: CardLevel.LEVEL2,
    token: Token.RUBY,
    prestigePoint: 2,
    cost: genCostMap([[Token.SAPPHIRE, 4], [Token.EMERALD, 2], [Token.DIAMOND, 1]]),
    imageUrl: DevelopmentCardImageUrl.RD2
  },
  {
    name: "RE2",
    level: CardLevel.LEVEL2,
    token: Token.RUBY,
    prestigePoint: 2,
    cost: genCostMap([[Token.ONYX, 5], [Token.DIAMOND, 3]]),
    imageUrl: DevelopmentCardImageUrl.RE2
  },
  {
    name: "RF2",
    level: CardLevel.LEVEL2,
    token: Token.RUBY,
    prestigePoint: 3,
    cost: genCostMap([[Token.RUBY, 6]]),
    imageUrl: DevelopmentCardImageUrl.RF2
  },

  {
    name: "OA2",
    level: CardLevel.LEVEL2,
    token: Token.ONYX,
    prestigePoint: 1,
    cost: genCostMap([[Token.DIAMOND, 3], [Token.SAPPHIRE, 2], [Token.EMERALD, 2]]),
    imageUrl: DevelopmentCardImageUrl.OA2
  },
  {
    name: "OB2",
    level: CardLevel.LEVEL2,
    token: Token.ONYX,
    prestigePoint: 1,
    cost: genCostMap([[Token.DIAMOND, 3], [Token.EMERALD, 3], [Token.ONYX, 2]]),
    imageUrl: DevelopmentCardImageUrl.OB2
  },
  {
    name: "OC2",
    level: CardLevel.LEVEL2,
    token: Token.ONYX,
    prestigePoint: 2,
    cost: genCostMap([[Token.DIAMOND, 5]]),
    imageUrl: DevelopmentCardImageUrl.OC2
  },
  {
    name: "OD2",
    level: CardLevel.LEVEL2,
    token: Token.ONYX,
    prestigePoint: 2,
    cost: genCostMap([[Token.EMERALD, 4], [Token.RUBY, 2], [Token.SAPPHIRE, 1]]),
    imageUrl: DevelopmentCardImageUrl.OD2
  },
  {
    name: "OE2",
    level: CardLevel.LEVEL2,
    token: Token.ONYX,
    prestigePoint: 2,
    cost: genCostMap([[Token.EMERALD, 5], [Token.RUBY, 3]]),
    imageUrl: DevelopmentCardImageUrl.OE2
  },
  {
    name: "OF2",
    level: CardLevel.LEVEL2,
    token: Token.ONYX,
    prestigePoint: 3,
    cost: genCostMap([[Token.ONYX, 6]]),
    imageUrl: DevelopmentCardImageUrl.OF2
  },
]

const level3Cards: CardType[] = [
  {
    name: "DA3",
    level: CardLevel.LEVEL3,
    token: Token.DIAMOND,
    prestigePoint: 3,
    cost: genCostMap([[Token.RUBY, 5], [Token.SAPPHIRE, 3], [Token.EMERALD, 3], [Token.ONYX, 3]]),
    imageUrl: DevelopmentCardImageUrl.DA3
  },
  {
    name: "DB3",
    level: CardLevel.LEVEL3,
    token: Token.DIAMOND,
    prestigePoint: 4,
    cost: genCostMap([[Token.ONYX, 7]]),
    imageUrl: DevelopmentCardImageUrl.DB3
  },
  {
    name: "DC3",
    level: CardLevel.LEVEL3,
    token: Token.DIAMOND,
    prestigePoint: 4,
    cost: genCostMap([[Token.ONYX, 6], [Token.RUBY, 3], [Token.DIAMOND, 3]]),
    imageUrl: DevelopmentCardImageUrl.DC3
  },
  {
    name: "DD3",
    level: CardLevel.LEVEL3,
    token: Token.DIAMOND,
    prestigePoint: 5,
    cost: genCostMap([[Token.ONYX, 7], [Token.DIAMOND, 3]]),
    imageUrl: DevelopmentCardImageUrl.DD3
  },

  {
    name: "SA3",
    level: CardLevel.LEVEL3,
    token: Token.SAPPHIRE,
    prestigePoint: 3,
    cost: genCostMap([[Token.ONYX, 5], [Token.RUBY, 3], [Token.EMERALD, 3], [Token.DIAMOND, 3]]),
    imageUrl: DevelopmentCardImageUrl.SA3
  },
  {
    name: "SB3",
    level: CardLevel.LEVEL3,
    token: Token.SAPPHIRE,
    prestigePoint: 4,
    cost: genCostMap([[Token.DIAMOND, 7]]),
    imageUrl: DevelopmentCardImageUrl.SB3
  },
  {
    name: "SC3",
    level: CardLevel.LEVEL3,
    token: Token.SAPPHIRE,
    prestigePoint: 4,
    cost: genCostMap([[Token.DIAMOND, 6], [Token.SAPPHIRE, 3], [Token.ONYX, 3]]),
    imageUrl: DevelopmentCardImageUrl.SC3
  },
  {
    name: "SD3",
    level: CardLevel.LEVEL3,
    token: Token.SAPPHIRE,
    prestigePoint: 5,
    cost: genCostMap([[Token.DIAMOND, 7], [Token.SAPPHIRE, 3]]),
    imageUrl: DevelopmentCardImageUrl.SD3
  },

  {
    name: "EA3",
    level: CardLevel.LEVEL3,
    token: Token.EMERALD,
    prestigePoint: 3,
    cost: genCostMap([[Token.DIAMOND, 5], [Token.RUBY, 3], [Token.SAPPHIRE, 3], [Token.ONYX, 3]]),
    imageUrl: DevelopmentCardImageUrl.EA3
  },
  {
    name: "EB3",
    level: CardLevel.LEVEL3,
    token: Token.EMERALD,
    prestigePoint: 4,
    cost: genCostMap([[Token.SAPPHIRE, 7]]),
    imageUrl: DevelopmentCardImageUrl.EB3
  },
  {
    name: "EC3",
    level: CardLevel.LEVEL3,
    token: Token.EMERALD,
    prestigePoint: 4,
    cost: genCostMap([[Token.SAPPHIRE, 6], [Token.EMERALD, 3], [Token.DIAMOND, 3]]),
    imageUrl: DevelopmentCardImageUrl.EC3
  },
  {
    name: "ED3",
    level: CardLevel.LEVEL3,
    token: Token.EMERALD,
    prestigePoint: 5,
    cost: genCostMap([[Token.SAPPHIRE, 7], [Token.EMERALD, 3]]),
    imageUrl: DevelopmentCardImageUrl.ED3
  },

  {
    name: "RA3",
    level: CardLevel.LEVEL3,
    token: Token.RUBY,
    prestigePoint: 3,
    cost: genCostMap([[Token.SAPPHIRE, 5], [Token.EMERALD, 3], [Token.DIAMOND, 3], [Token.ONYX, 3]]),
    imageUrl: DevelopmentCardImageUrl.RA3
  },
  {
    name: "RB3",
    level: CardLevel.LEVEL3,
    token: Token.RUBY,
    prestigePoint: 4,
    cost: genCostMap([[Token.EMERALD, 7]]),
    imageUrl: DevelopmentCardImageUrl.RB3
  },
  {
    name: "RC3",
    level: CardLevel.LEVEL3,
    token: Token.RUBY,
    prestigePoint: 4,
    cost: genCostMap([[Token.EMERALD, 6], [Token.RUBY, 3], [Token.SAPPHIRE, 3]]),
    imageUrl: DevelopmentCardImageUrl.RC3
  },
  {
    name: "RD3",
    level: CardLevel.LEVEL3,
    token: Token.RUBY,
    prestigePoint: 5,
    cost: genCostMap([[Token.EMERALD, 7], [Token.RUBY, 3]]),
    imageUrl: DevelopmentCardImageUrl.RD3
  },

  {
    name: "OA3",
    level: CardLevel.LEVEL3,
    token: Token.ONYX,
    prestigePoint: 3,
    cost: genCostMap([[Token.EMERALD, 5], [Token.RUBY, 3], [Token.SAPPHIRE, 3], [Token.DIAMOND, 3]]),
    imageUrl: DevelopmentCardImageUrl.OA3
  },
  {
    name: "OB3",
    level: CardLevel.LEVEL3,
    token: Token.ONYX,
    prestigePoint: 4,
    cost: genCostMap([[Token.RUBY, 7]]),
    imageUrl: DevelopmentCardImageUrl.OB3
  },
  {
    name: "OC3",
    level: CardLevel.LEVEL3,
    token: Token.ONYX,
    prestigePoint: 4,
    cost: genCostMap([[Token.RUBY, 6], [Token.EMERALD, 3], [Token.ONYX, 3]]),
    imageUrl: DevelopmentCardImageUrl.OC3
  },
  {
    name: "OD3",
    level: CardLevel.LEVEL3,
    token: Token.ONYX,
    prestigePoint: 5,
    cost: genCostMap([[Token.RUBY, 7], [Token.ONYX, 3]]),
    imageUrl: DevelopmentCardImageUrl.OD3
  },
]

export const developmentCardClasses = (): Record<CardLevel, DevelopmentCard[]> => ({
  [CardLevel.LEVEL1]: classify(level1Cards),
  [CardLevel.LEVEL2]: classify(level2Cards),
  [CardLevel.LEVEL3]: classify(level3Cards),
})
