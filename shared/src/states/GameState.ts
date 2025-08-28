import {ArraySchema, MapSchema, Schema, type} from "@colyseus/schema"
import {GamePhase} from "@shared/types";
import {Player} from "@shared/models/colyseus/Player";
import {DevelopmentCard} from "@shared/models/colyseus/DevelopmentCard";
import {NobleTile} from "@shared/models/colyseus/NobleTile";

export class GameState extends Schema {
  @type("string") gameId: string
  @type("string") hostId: string
  @type([Player]) players = new ArraySchema<Player>()
  @type("string") phase: GamePhase
  @type({ map: "uint8" }) tokens = new MapSchema<number>()
  @type([DevelopmentCard]) developmentCards = new ArraySchema<DevelopmentCard>()
  @type([NobleTile]) nobleTiles = new ArraySchema<NobleTile>()
  @type("uint8") turn: number
  @type("string") winnerPlayerId: string | null

  constructor(gameId: string, hostId: string) {
    super()
    this.gameId = gameId
    this.hostId = hostId
    this.phase = GamePhase.WAITING_FOR_PLAYERS
    this.turn = 0
    this.winnerPlayerId = null;
  }
}
