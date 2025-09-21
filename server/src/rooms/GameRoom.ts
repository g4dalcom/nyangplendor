import {Client, Room} from "colyseus"
import {
  CardAction,
  CardLevel,
  GameMetaDataType,
  GamePhase,
  Token,
  Transfer
} from "@shared/types";
import {GameState} from "@shared/states/GameState";
import {DevelopmentCard, developmentCardClasses} from "@shared/models/colyseus/DevelopmentCard";
import {shuffleArray} from "@shared/utils/random";
import {NobleTile, nobleTileClasses} from "@shared/models/colyseus/NobleTile";
import {Player} from "@shared/models/colyseus/Player";
import {
  convertMapSchemaToRecord,
  getCardBonus,
  getRequiredCardCost,
  getTotalTokens,
  initializeTokens
} from "@shared/utils/tokens";

export class GameRoom extends Room<GameState> {

  /* 방 만들면 메타데이터 입력하면서 GameState 초기화 */
  onCreate = async (options: any) => {
    console.log("onCreate ::: options ::: ", options)

    await this.setMetadata(<GameMetaDataType>{
      playerId: options?.id,
      nickname: options?.nickname,
      roomCode: options?.roomCode,
    })

    this.state = new GameState(this.roomId, options?.id);

    this.onMessage(Transfer.START_GAME, () => {
      console.log("===== Start Game ===== ")
      this.setupGameByPlayers();
      this.broadcast(Transfer.START_GAME, { message: "게임이 시작되었습니다!" });
    })

    this.onMessage(Transfer.NO_ACTION, () => {
      console.log("===== No Action ===== ")
      this.endTurn();
    })

    this.onMessage(Transfer.ACTION_BRING_TOKEN, (client, message) => {
      console.log("===== Bring Token ===== ")
      console.log("message: ", message)
      this.takeTokens(client.sessionId, message.params);
    })

    this.onMessage(Transfer.ACTION_PURCHASE_DEVELOPMENT_CARD, (client, message) => {
      console.log("===== Purchase Development Card ===== ")
      console.log("message: ", message)
      this.purchaseCard(client.sessionId, message.params);
    })

    this.onMessage(Transfer.ACTION_RESERVE_DEVELOPMENT_CARD, (client, message) => {
      console.log("===== Reserve Development Card ===== ")
      console.log("message: ", message)
      this.reservedCard(client.sessionId, message.params);
    })
  }

  /* 방 입장시 GameState에 플레이어 추가 */
  onJoin(client: Client, options: any) {
    console.log(`join: ${client.sessionId}`)
    this.addPlayer(client.sessionId, options.id, options.nickname)
  }

  onLeave(client: Client, consented: boolean) {
    console.log(`leave room: ${client.sessionId}`)
  }

  onDispose() {
    console.log("remove room")
  }

  /* ::: Prepare Game Phase ::: */
  public addPlayer = (sessionId: string, id: string, nickname: string) => {
    if (this.state.players.length < 4) {
      const existPlayer = this.state.existPlayerBySessionId(sessionId);
      if (!existPlayer) {
        const isHost = id === this.metadata.playerId;
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
      case 4: case 1:
        // TODO: TEST 후 롤백
        this.initializeTokens(7)
        this.initializeNobleTiles(5)
        break;
    }
    this.initializeCards()
    this.state.phase = GamePhase.GAME_START
    this.state.players[0].turn = true;
  }

  private initializeTokens = (tokenCount: number)=> {
    this.state.tokens.set(Token.RUBY, tokenCount)
    this.state.tokens.set(Token.EMERALD, tokenCount)
    this.state.tokens.set(Token.SAPPHIRE, tokenCount)
    this.state.tokens.set(Token.DIAMOND, tokenCount)
    this.state.tokens.set(Token.ONYX, tokenCount)
    this.state.tokens.set(Token.GOLD, 7)
  }

  private initializeCards = () => {
    const cardClasses = developmentCardClasses();
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
    const allNobleTiles: NobleTile[] = nobleTileClasses();
    shuffleArray(allNobleTiles)
    const inGameNobleTiles = allNobleTiles.slice(0, tileCount);
    this.state.nobleTiles.push(...inGameNobleTiles)
  }

  /* Player Turn Actions */
  public takeTokens = (sessionId: string, tokens: Record<Token, number>) => {
    const player = this.state.findPlayerBySessionId(sessionId);
    if (!this.validatePlayerTokenCount(player, tokens)) return;

    this.syncToken(player, tokens);
    this.endTurn();
  }

  private validatePlayerTokenCount = (player: Player, tokens: Record<Token, number>) => {
    const playerTokens = player.totalTokenCount;
    const bringOrReturnTokens = getTotalTokens(tokens);
    return playerTokens + bringOrReturnTokens <= 10;
  }

  private syncToken = (player: Player, tokens: Record<Token, number>) => {
    for (const [token, count] of Object.entries(tokens)) {
      const targetTokens = this.state.tokens.get(token) || 0;
      const playerTokens = player.tokens.get(token) || 0;
      this.state.tokens.set(token, targetTokens - count);
      player.tokens.set(token, playerTokens + count);
    }
  }

  public reservedCard = (sessionId: string, cardId: string) => {
    const player = this.state.findPlayerBySessionId(sessionId)
    const reservedCards = player.reservedCards || [];

    if (reservedCards.length === 3) return;

    const reservedCard = this.state.findDevelopmentCardById(cardId);
    this.syncCard(player, reservedCard, CardAction.RESERVE);

    const goldToken = this.state.tokens.get(Token.GOLD) || 0;
    if (goldToken > 0) {
      const tokens: Record<Token, number> = initializeTokens();
      tokens[Token.GOLD] = 1;
      this.syncToken(player, tokens)
    }

    this.endTurn();
  }

  public purchaseCard = (sessionId: string, cardId: string) => {
    const player = this.state.findPlayerBySessionId(sessionId);
    const purchasedCard = this.state.findDevelopmentCardById(cardId);

    const playerCardBonuses: Record<Token, number> = getCardBonus(player.developmentCards);
    const playerTokens: Record<Token, number> = convertMapSchemaToRecord(player.tokens);
    const actualCardCost: Record<Token, number> = getRequiredCardCost(purchasedCard.cost, playerCardBonuses);

    /* 부족분은 Gold 토큰으로 대체 */
    const tokens = initializeTokens();
    for (const [token, count] of Object.entries(actualCardCost)) {
      const playerToken = playerTokens[token as Token];
      if (playerToken < count) {
        const shortage = count - playerToken;
        tokens[Token.GOLD] -= shortage;
        tokens[token as Token] = -(playerToken);
      } else {
        tokens[token as Token] = -(count);
      }
    }

    this.syncCard(player, purchasedCard, CardAction.PURCHASE);
    this.syncToken(player, tokens);
    this.endTurn();
  }

  private syncCard = (player: Player, card: DevelopmentCard, action: CardAction) => {
    const cardIndex = this.state.developmentCards.findIndex(c => c.id === card.id);
    if (cardIndex === -1) return;

    switch (action) {
      case CardAction.RESERVE:
        player.reservedCards.push(card);
        break;
      case CardAction.PURCHASE:
        player.developmentCards.push(card);
        player.score += card.prestigePoint;
        break;
    }

    if (card.visible) {
      this.drawCard(card, cardIndex);
    } else {
      this.state.developmentCards.splice(cardIndex, 1);
    }
  }

  private drawCard = (targetCard: DevelopmentCard, cardIndex: number) => {
    const developmentCards = this.state.developmentCards;
    const cardLevel = targetCard.level;
    const cardDeck = developmentCards
      .filter(card => card.level === cardLevel)
      .filter(card => !card.visible);

    if (cardDeck.length > 0) {
      const topOfDeck = cardDeck[0];
      const topCardIndex = developmentCards.findIndex(d => d.id === topOfDeck.id);
      [developmentCards[topCardIndex], developmentCards[cardIndex]] = [developmentCards[cardIndex], developmentCards[topCardIndex]];

      developmentCards[cardIndex].visible = true;
      this.state.developmentCards.splice(topCardIndex, 1);
    } else {
      this.state.developmentCards.splice(cardIndex, 1);
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
        this.state.phase = GamePhase.GAME_END;
        return;
      }
    } else if (activePlayer.score >= 15) {
      activePlayer.endGame = true;
    }

    this.state.turn += 1;
    const activePlayerIndex = this.state.turn % this.state.players.length;
    const nextPlayer = this.state.players[activePlayerIndex];
    activePlayer.turn = false;
    nextPlayer.turn = true;
    this.notifyCurrentTurn(nextPlayer);
  }

  private notifyCurrentTurn = (player: Player) => {
    const sessionId = player.sessionId;
    const client = this.clients.find(c => c.sessionId === sessionId);
    if (client) {
      client.send(Transfer.PLAYER_TURN, { message: "Your turn!" });
    }
  }

  private visitNoble = (player: Player) => {
    const cardBonusMap: Record<Token, number> = initializeTokens();
    for (const card of player.developmentCards) {
      const token = card.token;
      cardBonusMap[token] += 1;
    }

    for (const nobleTile of this.state.nobleTiles) {
      let visitable = true;
      const cost = nobleTile.cost;
      for (const [token, count] of cost) {
        const bonusCount = cardBonusMap[token as Token];
        if (bonusCount < count) {
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
