import {ArraySchema, MapSchema, Schema, type} from "@colyseus/schema";
import {genCostMap, Token} from "@shared/types";

export class NobleTile extends Schema {
  //
  @type("string") id: string
  @type("string") name: string
  @type({ map: "uint8" }) cost: MapSchema<number>
  @type("number") point: number

  constructor() {
    super();
    this.id = ""
    this.name = ""
    this.cost = new MapSchema<number>()
    this.point = 3
  }
}

export class A extends NobleTile {
  id = "A"
  name = "A"
  cost = genCostMap([
    [Token.RUBY, 4],
    [Token.EMERALD, 4]
  ])
}

export class B extends NobleTile {
  id = "B"
  name = "B"
  cost = genCostMap([
    [Token.RUBY, 3],
    [Token.ONYX, 3],
    [Token.DIAMOND, 3],
  ])
}

export class C extends NobleTile {
  id = "C"
  name = "C"
  cost = genCostMap([
    [Token.SAPPHIRE, 4],
    [Token.DIAMOND, 4],
  ])
}

export class D extends NobleTile {
  id = "D"
  name = "D"
  cost = genCostMap([
    [Token.ONYX, 4],
    [Token.DIAMOND, 4],
  ])
}

export class E extends NobleTile {
  id = "E"
  name = "E"
  cost = genCostMap([
    [Token.EMERALD, 4],
    [Token.SAPPHIRE, 4],
  ])
}

export class F extends NobleTile {
  id = "F"
  name = "F"
  cost = genCostMap([
    [Token.EMERALD, 3],
    [Token.SAPPHIRE, 3],
    [Token.RUBY, 3],
  ])
}

export class G extends NobleTile {
  id = "G"
  name = "G"
  cost = genCostMap([
    [Token.EMERALD, 3],
    [Token.SAPPHIRE, 3],
    [Token.DIAMOND, 3],
  ])
}

export class H extends NobleTile {
  id = "H"
  name = "H"
  cost = genCostMap([
    [Token.RUBY, 4],
    [Token.ONYX, 4],
  ])
}

export class I extends NobleTile {
  id = "I"
  name = "I"
  cost = genCostMap([
    [Token.SAPPHIRE, 3],
    [Token.ONYX, 3],
    [Token.DIAMOND, 3],
  ])
}

export class J extends NobleTile {
  id = "J"
  name = "J"
  cost = genCostMap([
    [Token.RUBY, 3],
    [Token.ONYX, 3],
    [Token.EMERALD, 3],
  ])
}

export const makeNobleTiles: NobleTile[] = [
  new A(),
  new B(),
  new C(),
  new D(),
  new E(),
  new F(),
  new G(),
  new H(),
  new I(),
  new J(),
]