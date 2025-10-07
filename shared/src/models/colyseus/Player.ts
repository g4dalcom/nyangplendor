import {ArraySchema, MapSchema, Schema, type} from "@colyseus/schema"
import {DevelopmentCard} from "@shared/models/colyseus/DevelopmentCard";
import {NobleTile} from "@shared/models/colyseus/NobleTile";
import {initializeTokens} from "@shared/utils";

export class Player extends Schema {
  //
  @type("string") sessionId: string
  @type("string") id: string
  @type("string") name: string
  @type("uint8") score: number
  @type({ map: "uint8" }) tokens = new MapSchema<number>(initializeTokens())
  @type([DevelopmentCard]) developmentCards = new ArraySchema<DevelopmentCard>()
  @type([DevelopmentCard]) reservedCards = new ArraySchema<DevelopmentCard>()
  @type([NobleTile]) nobleTiles = new ArraySchema<NobleTile>()
  @type("boolean") host: boolean
  @type("boolean") ready: boolean
  @type("boolean") turn: boolean
  @type("boolean") endGame: boolean

  constructor(
    sessionId: string,
    id: string,
    name: string,
    host: boolean,
  ) {
    super();
    this.sessionId = sessionId;
    this.id = id;
    this.name = name;
    this.score = 0;
    this.host = host;
    this.ready = host;
    this.turn = false;
    this.endGame = false;
  }

  public resetPlayerState = () => {
    this.score = 0;
    this.tokens = new MapSchema<number>(initializeTokens());
    this.developmentCards = new ArraySchema<DevelopmentCard>();
    this.reservedCards = new ArraySchema<DevelopmentCard>();
    this.nobleTiles = new ArraySchema<NobleTile>();
    this.ready = this.host;
    this.endGame = false;
  }

  get totalTokenCount(): number {
    return Array.from(this.tokens.values()).reduce(
      (sum, count) => sum + count,
      0
    );
  }

  get totalPurchasedCardCount(): number {
    return this.developmentCards.length;
  }

  get totalNobleTileCount(): number {
    return this.nobleTiles.length;
  }
}
