import {ArraySchema, MapSchema, Schema, type} from "@colyseus/schema"
import {TokenCountMap} from "@shared/types";
import {Role} from "@shared/types/enums/States";
import {DevelopmentCard, NobleTile} from "@shared/models";

export class Player extends Schema {
  //
  @type("string") id: string
  @type("string") name: string
  @type("string") role: Role
  @type("uint8") score: number
  @type([DevelopmentCard]) developmentCards = new ArraySchema<DevelopmentCard>()
  @type({ map: "uint8" }) tokens: TokenCountMap = new MapSchema<number>()
  @type([NobleTile]) nobleTiles = new ArraySchema<NobleTile>()
  @type([DevelopmentCard]) reservedCards = new ArraySchema<DevelopmentCard>()
  @type("boolean") warning: boolean

  constructor(
    id: string,
    name: string,
    role: Role,
  ) {
    super();
    this.id = id;
    this.name = name;
    this.role = role;
    this.score = 0;
    this.warning = false;
  }
}
