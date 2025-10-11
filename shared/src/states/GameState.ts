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

  public resetGameState = () => {
    this.phase = GamePhase.WAITING_FOR_PLAYERS
    this.turn = 0
    this.winnerPlayerId = null;
    // this.developmentCards = new ArraySchema<DevelopmentCard>();
    // this.nobleTiles = new ArraySchema<NobleTile>();
    // this.tokens = new MapSchema<number>();
    // this.players.forEach(p => p.resetPlayerState());
  }

  public existPlayerBySessionId = (sessionId: string) => {
    return this.players.some(p => p.sessionId === sessionId);
  }

  public findPlayerBySessionId = (sessionId: string) => {
    const player = this.players.find(p => p.sessionId === sessionId);
    if (!player) {
      throw new Error(`Player with sessionId '${sessionId}' not found.`);
    }
    return player;
  }

  public findPlayerById = (id: string | null) => {
    if (!id) return;
    const player = this.players.find(p => p.id === id);
    if (!player) {
      throw new Error(`Player with id '${id}' not found.`);
    }
    return player;
  }

  public findDevelopmentCardById = (id: string) => {
    const card = this.developmentCards.find(card => card.id === id);
    if (!card) {
      throw new Error(`DevelopmentCard '${card}' not found.`);
    }
    return card
  }

  // public existReservedByDevelopmentCardId = (id: string) => {
  //   this.players.find(p => p.reservedCards?.find(c => c.id === id))
  // }
}
