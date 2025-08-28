import {Client, Room} from "colyseus"
import {
  CardAction,
  CardLevel,
  GameMetaDataType,
  GamePhase,
  Token,
  TokenAction,
  TokenCountMap,
  Transfer
} from "@shared/types";
import {GameState} from "@shared/states/GameState";
import {DevelopmentCard, developmentCardClasses} from "@shared/models/colyseus/DevelopmentCard";
import {shuffleArray} from "@shared/utils/random";
import {NobleTile, nobleTileClasses} from "@shared/models/colyseus/NobleTile";
import {Player} from "@shared/models/colyseus/Player";
import {MapSchema} from "@colyseus/schema";

export class GameRoom extends Room<GameState> {

  /* 방 만들면 메타데이터 입력하면서 GameState 초기화 */
  onCreate = async (options: any) => {
    console.log("onCreate ::: options ::: ", options)

    await this.setMetadata(<GameMetaDataType>{
      playerId: options?.playerId,
      nickname: options?.nickname,
      roomCode: options?.roomCode,
    })

    this.state = new GameState(this.roomId, options?.playerId);

    this.onMessage(Transfer.METADATA, (client) => {
      client.send(Transfer.METADATA, this.metadata);
    });

    this.onMessage(Transfer.ADD_PLAYER, (client, message) => {
      console.log("===== Add Player ===== ", message)
      const isHost = message.id === this.metadata.playerId;
      this.addPlayer(client.sessionId, message.id, message.nickname, isHost)
      this.broadcast(Transfer.ADD_PLAYER, this.state.players)
    })

    this.onMessage(Transfer.START_GAME, () => {
      console.log("===== Start Game ===== ")
      this.setupGameByPlayers();
      this.broadcast(Transfer.START_GAME, { message: "게임이 시작되었습니다!" });
    })
  }

  /* 방 입장시 GameState에 플레이어 추가 */
  onJoin(client: Client, options: any) {
    console.log(`join: ${client.sessionId}`)
  }

  onLeave(client: Client, consented: boolean) {
    console.log(`leave room: ${client.sessionId}`)
  }

  onDispose() {
    console.log("remove room")
  }

  /* ::: Prepare Game Phase ::: */
  public addPlayer = (sessionId: string, id: string, nickname: string, isHost: boolean) => {
    if (this.state.players.length < 4) {
      if (!this.state.players.find(p => p.id === id)) {
        this.state.players.push(new Player(sessionId, id, nickname, isHost))
      }
    }
  }

  /* ::: Start Game Phase ::: */
  public setupGameByPlayers = () => {
    const playerCount = this.state.players.length;
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
    this.state.phase = GamePhase.GAME_START
  }

  private initializeTokens = (tokenCount: number)=> {
    this.state.tokens.set(Token.EMERALD, tokenCount)
    this.state.tokens.set(Token.SAPPHIRE, tokenCount)
    this.state.tokens.set(Token.DIAMOND, tokenCount)
    this.state.tokens.set(Token.ONYX, tokenCount)
    this.state.tokens.set(Token.GOLD, 7)
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

    this.state.developmentCards.push(...Object.values(cardClasses).flat());
  }

  private initializeNobleTiles = (tileCount: number) => {
    const allNobleTiles: NobleTile[] = nobleTileClasses;
    shuffleArray(allNobleTiles)
    const inGameNobleTiles = allNobleTiles.slice(0, tileCount);
    this.state.nobleTiles.push(...inGameNobleTiles)
  }

  /* Player Turn Actions */
  public takeTokens = (playerId: string, tokenMap: TokenCountMap) => {
    if (!this.validateTakeTokens(tokenMap)) return;
    this.syncToken(playerId, tokenMap, TokenAction.BRING)

    if (!this.validatePlayerTokenCount(playerId)) {
      const player = this.state.players.find(player => player.id === playerId) as Player;
      const client = this.clients.find(client => client.sessionId === player.sessionId) as Client;
      client.send(Transfer.RETURN_TOKEN);
    }

    this.endTurn();
  }

  private validateTakeTokens = (tokenMap: TokenCountMap) => {
    const tokenMapSize = tokenMap.size;
    switch (tokenMapSize) {
      case 1:
        const firstEntry = tokenMap.entries().next().value;
        if (!firstEntry) return false;

        const [token, count] = firstEntry;
        if (count !== 2) return false;
        const targetTokens = this.state.tokens.get(token) || 0;
        return targetTokens < 4;
      case 3:
        for (const count of tokenMap.values()) {
          if (count !== 1) {
            return false;
          }
        }
        return true;
      default:
        return false;
    }
  }

  private validatePlayerTokenCount = (playerId: string) => {
    const player = this.state.players.find(player => player.id === playerId) as Player;
    return Array.from(player.tokens.values()).reduce((prev, current) => prev + current, 0) <= 10;
  }

  private returnTokens = (playerId: string, tokenMap: TokenCountMap) => {
    this.syncToken(playerId, tokenMap, TokenAction.RETURN)
    this.endTurn();
  }

  private syncToken = (playerId: string, tokenMap: TokenCountMap, action: TokenAction) => {
    const player = this.state.players.find(p => p.id === playerId) as Player;
    for (const [token, count] of tokenMap.entries()) {
      const targetTokens = this.state.tokens.get(token) || 0;
      const playerTokens = player.tokens.get(token) || 0;

      switch (action) {
        case TokenAction.BRING:
          this.state.tokens.set(token, targetTokens - count)
          player.tokens.set(token, playerTokens + count)
          break;
        case TokenAction.RETURN:
          this.state.tokens.set(token, targetTokens + count)
          player.tokens.set(token, playerTokens - count)
          break;
      }
    }
  }

  public reservedCard = (playerId: string, cardId: string) => {
    const player = this.state.players.find(p => p.id === playerId) as Player;
    const reservedCards = player.reservedCards || [];

    if (reservedCards.length === 3) return;

    const reservedCard = this.state.developmentCards.find(c => c.id === cardId) as DevelopmentCard;
    this.syncCard(player, reservedCard, CardAction.RESERVE);

    const goldToken = this.state.tokens.get(Token.GOLD) || 0;
    if (goldToken > 0) {
      const tokenMap: TokenCountMap = new MapSchema();
      tokenMap.set(Token.GOLD, 1);
      this.syncToken(playerId, tokenMap, TokenAction.BRING)
    }

    this.endTurn();
  }

  public purchaseCard = (playerId: string, cardId: string, tokenMap: TokenCountMap) => {
    const player = this.state.players.find(p => p.id === playerId) as Player;
    const purchasedCard = this.state.developmentCards.find(c => c.id === cardId) as DevelopmentCard;
    if (this.validatePurchase(player, purchasedCard, tokenMap)) {
      this.syncCard(player, purchasedCard, CardAction.PURCHASE);
      this.returnTokens(playerId, tokenMap);
    }

    this.endTurn();
  }

  /* '카드 보너스 + 보유 토큰'으로 구매 가능한지 */
  private validatePurchase = (player: Player, card: DevelopmentCard, tokenMap: TokenCountMap) => {
    const playerOwnedCardMap = new MapSchema<number>();
    player.developmentCards.forEach(ownedCard => {
      const token = ownedCard.token;
      playerOwnedCardMap.set(token, (playerOwnedCardMap.get(token) || 0) + 1);
    });

    const requiredTokens = card.cost;

    for (const [token, count] of requiredTokens.entries()) {
      const payment = (tokenMap.get(token) || 0) + (playerOwnedCardMap.get(token) || 0);
      if (payment < count) return false;
    }
    return true;
  }

  private syncCard = (player: Player, card: DevelopmentCard, action: CardAction) => {
    const cardIndex = this.state.developmentCards.findIndex(c => c.id === card.id);
    if (cardIndex === -1) return;

    this.state.developmentCards.splice(cardIndex, 1);

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

  private endTurn = () => {
    const playerIndex = this.state.turn % this.state.players.length;
    const activePlayer = this.state.players[playerIndex];

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

    this.state.turn += 1;
    const activePlayerIndex = this.state.turn % this.state.players.length;
    activePlayer.turn = false;
    this.state.players[activePlayerIndex].turn = true;
  }

  private visitNoble = (player: Player) => {
    const cardBonusMap: Map<string, number> = new Map();
    for (const card of player.developmentCards) {
      const token = card.token;
      cardBonusMap.set(token, (cardBonusMap.get(token) || 0) + 1);
    }

    for (const nobleTile of this.state.nobleTiles) {
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
    const tileIndex = this.state.nobleTiles.findIndex(tile => tile.id === nobleTile.id);
    if (tileIndex === -1) return;
    this.state.nobleTiles.splice(tileIndex, 1);
    player.nobleTiles.push(nobleTile);
    player.score += nobleTile.point;
  }

  private findEndGamePlayer = () => {
    return this.state.players.find(player => player.endGame);
  }

  private allPlayersEndGame = () => {
    return this.state.players.every(player => player.endGame);
  }

  private determineWinner = () => {
    const maxScorePlayers = this.findMaxScorePlayers();
    if (maxScorePlayers.length === 1) {
      this.state.winnerPlayerId = maxScorePlayers[0].id;
      return;
    }

    const fewestCardPurchasedPlayers = this.findPlayersWithFewestCards(maxScorePlayers);
    if (fewestCardPurchasedPlayers.length === 1) {
      this.state.winnerPlayerId = fewestCardPurchasedPlayers[0].id;
      return;
    }

    const fewestOwnedNobleTilePlayers = this.findPlayersWithFewestNobleTiles(fewestCardPurchasedPlayers);
    if (fewestOwnedNobleTilePlayers.length === 1) {
      this.state.winnerPlayerId = fewestOwnedNobleTilePlayers[0].id;
      return;
    }

    this.state.winnerPlayerId = fewestOwnedNobleTilePlayers.join('+');
  }

  private findMaxScorePlayers = () => {
    const maxScore = this.state.players.map(player => player.score).reduce((prev, current) => Math.max(prev, current));
    return this.state.players.filter(player => player.score === maxScore);
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
