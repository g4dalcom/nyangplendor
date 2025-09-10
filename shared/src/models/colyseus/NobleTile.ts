import {MapSchema, Schema, type} from "@colyseus/schema";
import {NobleTileImageUrl, Token} from "@shared/types";
import {nanoid} from "nanoid";
import {genCostMap} from "@shared/utils";

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
    imageUrl: string = '/nobleTiles/A.webp',
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
  return nobleTiles.map(nobleTile => new NobleTile(
    nobleTile.name,
    new MapSchema<number>(Object.fromEntries(nobleTile.cost.entries())),
    nobleTile.imageUrl
  ))
}

const nobleTiles: NobleTileType[] = [
  {
    name: "A",
    cost: genCostMap([[Token.RUBY, 4], [Token.EMERALD, 4]]),
    imageUrl: NobleTileImageUrl.A
  },
  {
    name: "B",
    cost: genCostMap([[Token.RUBY, 3], [Token.DIAMOND, 3], [Token.ONYX, 3]]),
    imageUrl: NobleTileImageUrl.B
  },
  {
    name: "C",
    cost: genCostMap([[Token.SAPPHIRE, 4], [Token.DIAMOND, 4]]),
    imageUrl: NobleTileImageUrl.C
  },
  {
    name: "D",
    cost: genCostMap([[Token.DIAMOND, 4], [Token.ONYX, 4]]),
    imageUrl: NobleTileImageUrl.D
  },
  {
    name: "E",
    cost: genCostMap([[Token.SAPPHIRE, 4], [Token.EMERALD, 4]]),
    imageUrl: NobleTileImageUrl.E
  },
  {
    name: "F",
    cost: genCostMap([[Token.RUBY, 3], [Token.SAPPHIRE, 3], [Token.EMERALD, 3]]),
    imageUrl: NobleTileImageUrl.F
  },
  {
    name: "G",
    cost: genCostMap([[Token.SAPPHIRE, 3], [Token.EMERALD, 3], [Token.DIAMOND, 3]]),
    imageUrl: NobleTileImageUrl.G
  },
  {
    name: "H",
    cost: genCostMap([[Token.RUBY, 4], [Token.ONYX, 4]]),
    imageUrl: NobleTileImageUrl.H
  },
  {
    name: "I",
    cost: genCostMap([[Token.SAPPHIRE, 3], [Token.DIAMOND, 3], [Token.ONYX, 3]]),
    imageUrl: NobleTileImageUrl.I
  },
  {
    name: "J",
    cost: genCostMap([[Token.RUBY, 3], [Token.EMERALD, 3], [Token.ONYX, 3]]),
    imageUrl: NobleTileImageUrl.J
  },
]

export const nobleTileClasses = (): NobleTile[] => classify(nobleTiles);