import {MapSchema, Schema, type} from "@colyseus/schema"
import {TokenCountMap} from "@shared/types";

export class Player extends Schema {
  //
  @type("string") id: string
  @type("string") name: string
  @type("uint8") score: number
  @type({ map: "uint8" }) tokens: TokenCountMap = new MapSchema<number>()
  @type("boolean") warning: boolean

  constructor(
    id: string,
    name: string,
  ) {
    super();
    this.id = id;
    this.name = name;
    this.score = 0;
    this.warning = false;
  }
}
