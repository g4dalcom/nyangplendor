import {MapSchema, Schema, type} from "@colyseus/schema";
import {genCostMap, Token} from "@shared/types";
import {nanoid} from "nanoid";

type NobleTileType = {
  name: string
  cost: MapSchema<number>
  imageUrl?: string
}

export class NobleTile extends Schema {
  //
  @type("string") id: string
  @type("string") name: string
  @type({ map: "uint8" }) cost: MapSchema<number>
  @type("uint8") point: number
  @type("string") imageUrl: string

  constructor(
    name: string,
    cost: MapSchema<number>,
    imageUrl: string = '@/assets/images/developmentCards/sample-card.png',
  ) {
    super();
    this.id = nanoid()
    this.name = name
    this.cost = cost
    this.point = 3
    this.imageUrl = imageUrl
  }
}

const classify = (nobleTiles: NobleTileType[]): NobleTile[] => {
  return nobleTiles.map(nobleTile => new NobleTile(nobleTile.name, nobleTile.cost))
}

const nobleTiles: NobleTileType[] = [
  { name: "A", cost: genCostMap([[Token.RUBY, 4], [Token.EMERALD, 4]]) },
  { name: "B", cost: genCostMap([[Token.RUBY, 3], [Token.DIAMOND, 3], [Token.ONYX, 3]]) },
  { name: "C", cost: genCostMap([[Token.SAPPHIRE, 4], [Token.DIAMOND, 4]]) },
  { name: "D", cost: genCostMap([[Token.DIAMOND, 4], [Token.ONYX, 4]]) },
  { name: "E", cost: genCostMap([[Token.SAPPHIRE, 4], [Token.EMERALD, 4]]) },
  { name: "F", cost: genCostMap([[Token.RUBY, 3], [Token.SAPPHIRE, 3], [Token.EMERALD, 3]]) },
  { name: "G", cost: genCostMap([[Token.SAPPHIRE, 3], [Token.EMERALD, 3], [Token.DIAMOND, 3]]) },
  { name: "H", cost: genCostMap([[Token.RUBY, 4], [Token.ONYX, 4]]) },
  { name: "I", cost: genCostMap([[Token.SAPPHIRE, 3], [Token.DIAMOND, 3], [Token.ONYX, 3]]) },
  { name: "J", cost: genCostMap([[Token.RUBY, 3], [Token.EMERALD, 3], [Token.ONYX, 3]]) },
]

export const nobleTileClasses: NobleTile[] = classify(nobleTiles);