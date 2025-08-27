import {ArraySchema, MapSchema, Schema, type} from "@colyseus/schema"
import {TokenCountMap} from "@shared/types";
import {DevelopmentCard} from "@shared/models/colyseus/DevelopmentCard";
import {NobleTile} from "@shared/models/colyseus/NobleTile";

export class Player extends Schema {
  //
  @type("string") id: string
  @type("string") name: string
  @type("uint8") score: number
  @type({ map: "uint8" }) tokens: TokenCountMap = new MapSchema<number>()
  @type([DevelopmentCard]) developmentCards = new ArraySchema<DevelopmentCard>()
  @type([DevelopmentCard]) reservedCards = new ArraySchema<DevelopmentCard>()
  @type([NobleTile]) nobleTiles = new ArraySchema<NobleTile>()
  @type("boolean") warning: boolean
  @type("boolean") host: boolean
  @type("boolean") ready: boolean
  @type("boolean") turn: boolean
  @type("boolean") endGame: boolean

  constructor(
    id: string,
    name: string,
  ) {
    super();
    this.id = id;
    this.name = name;
    this.score = 0;
    this.warning = false;
    this.host = false;
    this.ready = false;
    this.turn = false;
    this.endGame = false;
  }
}
