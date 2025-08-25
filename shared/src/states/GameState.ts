import {ArraySchema, MapSchema, Schema, type} from "@colyseus/schema"
import {CardLevel, CardLocation, GamePhase, Token, TokenAction} from "@shared/types";
import {shuffleArray} from "@shared/utils";
import {Player} from "@shared/models/colyseus/Player";
import {DevelopmentCard, developmentCardClasses} from "@shared/models/colyseus/DevelopmentCard";
import {NobleTile, nobleTileClasses} from "@shared/models/colyseus/NobleTile";

export class GameState extends Schema {
  @type("string") gameId: string
  @type([Player]) players = new ArraySchema<Player>()
  @type("string") phase: GamePhase
  @type({ map: "uint8" }) tokens = new MapSchema<number>()
  @type([DevelopmentCard]) developmentCards = new ArraySchema<DevelopmentCard>()
  @type([NobleTile]) nobleTiles = new ArraySchema<NobleTile>()

  constructor(gameId: string) {
    super()
    this.gameId = gameId
    this.phase = GamePhase.WAITING_FOR_PLAYERS
  }

  /* ::: Prepare Game Phase ::: */
  public addPlayer = (id: string, nickname: string) => {
    if (this.players.length < 4) {
      if (!this.players.find(p => p.id === id)) {
        this.players.push(new Player(id, nickname))
      }
    }
  }

  /* ::: Start Game Phase ::: */
  public setupGameByPlayers = () => {
    const playerCount = this.players.length;
    switch (playerCount) {
      case 2:
        this.initializeTokens(4)
        this.initializeNobleTiles(3)
        break;
      case 3:
        this.initializeTokens(5)
        this.initializeNobleTiles(4)
        break;
      case 4:
        this.initializeTokens(7)
        this.initializeNobleTiles(5)
        break;
    }
    this.initializeCards()
    this.phase = GamePhase.GAME_START
  }

  private initializeTokens = (tokenCount: number)=> {
    this.tokens.set(Token.EMERALD, tokenCount)
    this.tokens.set(Token.SAPPHIRE, tokenCount)
    this.tokens.set(Token.DIAMOND, tokenCount)
    this.tokens.set(Token.ONYX, tokenCount)
    this.tokens.set(Token.GOLD, 7)
  }

  private initializeCards = () => {
    const cardClasses = developmentCardClasses;
    shuffleArray(cardClasses[CardLevel.LEVEL1])
    shuffleArray(cardClasses[CardLevel.LEVEL2])
    shuffleArray(cardClasses[CardLevel.LEVEL3])

    for (let i = 0; i < 4; i++) {
      cardClasses[CardLevel.LEVEL1][i].location = CardLocation.BOARD;
      cardClasses[CardLevel.LEVEL1][i].visible = true;
      cardClasses[CardLevel.LEVEL2][i].location = CardLocation.BOARD;
      cardClasses[CardLevel.LEVEL2][i].visible = true;
      cardClasses[CardLevel.LEVEL3][i].location = CardLocation.BOARD;
      cardClasses[CardLevel.LEVEL3][i].visible = true;
    }

    this.developmentCards.push(...Object.values(cardClasses).flat());
  }

  private initializeNobleTiles = (tileCount: number) => {
    const allNobleTiles: NobleTile[] = nobleTileClasses;
    shuffleArray(allNobleTiles)
    this.nobleTiles.push(...allNobleTiles.slice(0, tileCount))
  }

  /* Player Turn Actions */
  public takeTwoOfSameColorTokens = (playerId: string, token: Token, returnTokenMap?: Record<Token, number>) => {
    const targetTokens = this.tokens.get(token) || 0;
    if (targetTokens < 4) return;

    this.syncToken(playerId, token, 2, TokenAction.BRING)

    if (returnTokenMap) {
      this.returnTokens(playerId, returnTokenMap);
    }
  }

  public takeThreeOfDifferentColorTokens = (playerId: string, tokens: Token[], returnTokenMap?: Record<Token, number>) => {
    for (const token of tokens) {
      this.syncToken(playerId, token, 1, TokenAction.BRING)
    }

    if (returnTokenMap) {
      this.returnTokens(playerId, returnTokenMap);
    }
  }

  private returnTokens = (playerId: string, tokenMap: Record<Token, number>) => {
    for (const [token, returnCount] of Object.entries(tokenMap)) {
      this.syncToken(playerId, token as Token, returnCount, TokenAction.RETURN)
    }
  }

  public reservedCard = (playerId: string, cardId: string) => {
    const reservedCards = this.developmentCards
      .filter(c => c.location === CardLocation.RESERVED)
      .filter(c => c.ownerId === playerId);

    if (reservedCards.length === 3) return;

    const card = this.developmentCards.find(c => c.id === cardId) as DevelopmentCard;
    card.location = CardLocation.RESERVED;
    card.ownerId = playerId;

    const goldToken = this.tokens.get(Token.GOLD) || 0;
    if (goldToken > 0) {
      this.syncToken(playerId, Token.GOLD, 1, TokenAction.BRING)
    }
  }

  public purchaseCard = (playerId: string, cardId: string, tokenMap: Record<Token, number>) => {
    const targetCard = this.developmentCards.find(c => c.id === cardId) as DevelopmentCard;
    if (this.validatePurchase(playerId, targetCard, tokenMap)) {
      const player = this.players.find(p => p.id === playerId) as Player;
      player.score += targetCard.prestigePoint;
      targetCard.location = CardLocation.PLAYER;
      targetCard.ownerId = playerId;
      this.returnTokens(playerId, tokenMap);
    }
  }

  private validatePurchase = (playerId: string, targetCard: DevelopmentCard, tokenMap: Record<Token, number>) => {
    const playerOwnedCardMap = this.developmentCards
      .filter(c => c.ownerId === playerId)
      .reduce((record, card) => {
        const token = card.token;
        record[token] = (record[token] ?? 0) + 1;
        return record;
      }, {} as Record<Token, number>);

    const requiredTokens = targetCard.cost;
    for (const [tokenString, count] of Object.entries(requiredTokens)) {
      const token = tokenString as Token;
      const payment = tokenMap[token] + playerOwnedCardMap[token]
      if (payment < count) return false;
    }
    return true;
  }

  private syncToken = (playerId: string, token: Token, count: number, action: TokenAction) => {
    const player = this.players.find(p => p.id === playerId) as Player;
    const targetTokens = this.tokens.get(token) || 0;
    const playerToken = player.tokens.get(token) || 0;

    switch (action) {
      case TokenAction.BRING:
        this.tokens.set(token, targetTokens - count)
        player.tokens.set(token, playerToken + count)
        break;
      case TokenAction.RETURN:
        this.tokens.set(token, targetTokens + count)
        player.tokens.set(token, playerToken - count)
        break;
    }
  }
}
