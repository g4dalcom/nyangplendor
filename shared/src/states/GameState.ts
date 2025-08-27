import {ArraySchema, MapSchema, Schema, type} from "@colyseus/schema"
import {CardAction, CardLevel, GamePhase, Token, TokenAction} from "@shared/types";
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
  @type("uint8") turn: number
  @type("string") winnerPlayerId: string | null

  constructor(gameId: string) {
    super()
    this.gameId = gameId
    this.phase = GamePhase.WAITING_FOR_PLAYERS
    this.turn = 0
    this.winnerPlayerId = null;
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
      cardClasses[CardLevel.LEVEL1][i].visible = true;
      cardClasses[CardLevel.LEVEL2][i].visible = true;
      cardClasses[CardLevel.LEVEL3][i].visible = true;
    }

    this.developmentCards.push(...Object.values(cardClasses).flat());
  }

  private initializeNobleTiles = (tileCount: number) => {
    const allNobleTiles: NobleTile[] = nobleTileClasses;
    shuffleArray(allNobleTiles)
    const inGameNobleTiles = allNobleTiles.slice(0, tileCount);
    this.nobleTiles.push(...inGameNobleTiles)
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
    const player = this.players.find(p => p.id === playerId) as Player;
    const reservedCards = player.reservedCards || [];

    if (reservedCards.length === 3) return;

    const reservedCard = this.developmentCards.find(c => c.id === cardId) as DevelopmentCard;
    this.syncCard(player, reservedCard, CardAction.RESERVE);

    const goldToken = this.tokens.get(Token.GOLD) || 0;
    if (goldToken > 0) {
      this.syncToken(playerId, Token.GOLD, 1, TokenAction.BRING)
    }
  }

  public purchaseCard = (playerId: string, cardId: string, tokenMap: Record<Token, number>) => {
    const player = this.players.find(p => p.id === playerId) as Player;
    const purchasedCard = this.developmentCards.find(c => c.id === cardId) as DevelopmentCard;
    if (this.validatePurchase(player, purchasedCard, tokenMap)) {
      this.syncCard(player, purchasedCard, CardAction.PURCHASE);
      this.returnTokens(playerId, tokenMap);
    }
  }

  private syncCard = (player: Player, card: DevelopmentCard, action: CardAction) => {
    const cardIndex = this.developmentCards.findIndex(c => c.id === card.id);
    if (cardIndex === -1) return;

    this.developmentCards.splice(cardIndex, 1);

    switch (action) {
      case CardAction.RESERVE:
        player.reservedCards.push(card);
        break;
      case CardAction.PURCHASE:
        player.developmentCards.push(card);
        player.score += card.prestigePoint;
        break;
    }
  }

  /* '카드 보너스 + 보유 토큰'으로 구매 가능한지 */
  private validatePurchase = (player: Player, card: DevelopmentCard, tokenMap: Record<Token, number>) => {
    const playerOwnedCardMap = player.developmentCards
      .reduce((record, card) => {
        const token = card.token;
        record[token] = (record[token] ?? 0) + 1;
        return record;
      }, {} as Record<Token, number>);

    const requiredTokens = card.cost;
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

  public endTurn = () => {
    const playerIndex = this.turn % this.players.length;
    const activePlayer = this.players[playerIndex];

    this.visitNoble(activePlayer);

    if (this.findEndGamePlayer()) {
      activePlayer.endGame = true;

      if (this.allPlayersEndGame()) {
        this.determineWinner();
        return;
      }
    } else if (activePlayer.score >= 15) {
      activePlayer.endGame = true;
    }

    this.turn += 1;
    const activePlayerIndex = this.turn % this.players.length;
    activePlayer.turn = false;
    this.players[activePlayerIndex].turn = true;
  }

  private visitNoble = (player: Player) => {
    const cardBonusMap: Map<string, number> = new Map();
    for (const card of player.developmentCards) {
      const token = card.token;
      cardBonusMap.set(token, (cardBonusMap.get(token) || 0) + 1);
    }

    for (const nobleTile of this.nobleTiles) {
      let visitable = true;
      const cost = nobleTile.cost;
      for (const [token, count] of cost) {
        const bonusCount = cardBonusMap.get(token);
        if (bonusCount && bonusCount < count) {
          visitable = false;
          break;
        }
      }

      if (visitable) {
        this.syncNobleTile(player, nobleTile);
        return;
      }
    }
  }

  private syncNobleTile = (player: Player, nobleTile: NobleTile) => {
    const tileIndex = this.nobleTiles.findIndex(tile => tile.id === nobleTile.id);
    if (tileIndex === -1) return;
    this.nobleTiles.splice(tileIndex, 1);
    player.nobleTiles.push(nobleTile);
    player.score += nobleTile.point;
  }

  private findEndGamePlayer = () => {
    return this.players.find(player => player.endGame);
  }

  private allPlayersEndGame = () => {
    return this.players.every(player => player.endGame);
  }

  private determineWinner = () => {
    const maxScorePlayers = this.findMaxScorePlayers();
    if (maxScorePlayers.length === 1) {
      this.winnerPlayerId = maxScorePlayers[0].id;
      return;
    }

    const fewestCardPurchasedPlayers = this.findPlayersWithFewestCards(maxScorePlayers);
    if (fewestCardPurchasedPlayers.length === 1) {
      this.winnerPlayerId = fewestCardPurchasedPlayers[0].id;
      return;
    }

    const fewestOwnedNobleTilePlayers = this.findPlayersWithFewestNobleTiles(fewestCardPurchasedPlayers);
    if (fewestOwnedNobleTilePlayers.length === 1) {
      this.winnerPlayerId = fewestOwnedNobleTilePlayers[0].id;
      return;
    }

    this.winnerPlayerId = fewestOwnedNobleTilePlayers.join('+');
  }

  private findMaxScorePlayers = () => {
    const maxScore = this.players.map(player => player.score).reduce((prev, current) => Math.max(prev, current));
    return this.players.filter(player => player.score === maxScore);
  }

  private findPlayersWithFewestCards = (maxScorePlayers: Player[]) => {
    const minCount = Math.min(...maxScorePlayers.map(player => player.developmentCards.length));
    return maxScorePlayers.filter(player => player.developmentCards.length === minCount);
  }

  private findPlayersWithFewestNobleTiles = (fewestCardPurchasedPlayers: Player[]) => {
    const minCount = Math.min(...fewestCardPurchasedPlayers.map(player => player.nobleTiles.length));
    return fewestCardPurchasedPlayers.filter(player => player.nobleTiles.length === minCount);
  }
}
