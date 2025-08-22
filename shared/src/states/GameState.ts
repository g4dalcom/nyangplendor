import {ArraySchema, MapSchema, Schema, type} from "@colyseus/schema"
import {CardLevel, GamePhase, Role, Token} from "@shared/types";
import {shuffleArray} from "@shared/utils";
import {Player} from "@shared/models/colyseus/Player";
import {DevelopmentCard, DevelopmentCardClasses} from "@shared/models/colyseus/DevelopmentCard";
import {makeNobleTiles, NobleTile} from "@shared/models/colyseus/NobleTile";

export class GameState extends Schema {
  @type("string") gameId: string
  @type([Player]) players = new ArraySchema<Player>()
  @type("string") phase: GamePhase
  @type("uint8") currentPlayerIndex: number
  @type({ map: "uint8" }) tokens = new MapSchema<number>()
  @type([DevelopmentCard]) level1Cards = new ArraySchema<DevelopmentCard>()
  @type([DevelopmentCard]) level2Cards = new ArraySchema<DevelopmentCard>()
  @type([DevelopmentCard]) level3Cards = new ArraySchema<DevelopmentCard>()
  @type([NobleTile]) nobleTiles = new ArraySchema<NobleTile>()

  constructor(gameId: string) {
    super()
    this.gameId = gameId
    this.phase = GamePhase.WAITING_FOR_PLAYERS
    this.currentPlayerIndex = 0
    this.initializeTokens()
    this.initializeCards()
    this.initializeNobleTiles()
  }

  private initializeTokens = ()=> {
    this.tokens.set(Token.EMERALD, 7)
    this.tokens.set(Token.SAPPHIRE, 7)
    this.tokens.set(Token.DIAMOND, 7)
    this.tokens.set(Token.ONYX, 7)
    this.tokens.set(Token.GOLD, 7)
  }

  private initializeCards = () => {
    const cardClasses = DevelopmentCardClasses;
    shuffleArray(cardClasses[CardLevel.LEVEL1])
    this.level1Cards.push(...cardClasses[CardLevel.LEVEL1])
    shuffleArray(cardClasses[CardLevel.LEVEL2])
    this.level2Cards.push(...cardClasses[CardLevel.LEVEL2])
    shuffleArray(cardClasses[CardLevel.LEVEL3])
    this.level3Cards.push(...cardClasses[CardLevel.LEVEL3])
  }

  private initializeNobleTiles = () => {
    const allNobleTiles: NobleTile[] = makeNobleTiles;
    shuffleArray(allNobleTiles)
    this.nobleTiles.push(...allNobleTiles.slice(0, 3))
  }

  public addPlayer = (id: string, nickname: string) => {
    if (this.players.length < 4) {
      this.players.push(new Player(id, nickname, Role.PLAYER))
    }
  }
}
