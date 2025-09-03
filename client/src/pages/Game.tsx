import {useEffect, useRef, useState} from "react"
import {CardLevel, GamePhase, Token, Transfer, TurnAction} from "@shared/types";
import {useGameRoom} from "@/contexts";
import type {Player} from "@shared/models/colyseus/Player";
import "./Game.css";
import rubyToken from "@/assets/icons/churu.svg";
import sapphireToken from "@/assets/icons/tuna.svg";
import emeraldToken from "@/assets/icons/fishing-toy.svg";
import diamondToken from "@/assets/icons/yarn-ball.svg";
import onyxToken from "@/assets/icons/fish.svg";
import goldToken from "@/assets/icons/gold.svg";

const tokenImages = {
  [Token.RUBY]: rubyToken,
  [Token.SAPPHIRE]: sapphireToken,
  [Token.EMERALD]: emeraldToken,
  [Token.DIAMOND]: diamondToken,
  [Token.ONYX]: onyxToken,
  [Token.GOLD]: goldToken,
}

export const Game = () => {
  //
  const { gameRoom, gameState, player } = useGameRoom();
  const [tokenMap, setTokenMap] = useState<Map<Token, number>>(new Map());
  const turnAction = useRef<TurnAction>(TurnAction.NO_ACTION);
  const disableStartButton = !player?.host || gameState!.players.length < 2 || gameState?.phase !== GamePhase.WAITING_FOR_PLAYERS;
  const disableTurnEndButton = !player?.turn;

  useEffect(() => {
    setTokenMap(new Map());
    turnAction.current = TurnAction.NO_ACTION;
  }, [gameState?.turn]);

  const handleStartGame = () => {
    gameRoom?.send(Transfer.START_GAME)
    console.log("Game Start = ", gameRoom?.state)
  };

  const handleEndTurn = () => {
    let messageType = Transfer.NO_ACTION;

    switch (turnAction.current) {
      case TurnAction.BRING_TOKEN:
        messageType = Transfer.BRING_TOKEN;
        break;
    }
    gameRoom?.send(messageType, { tokenMap })
    console.log("End Turn = ", gameRoom?.state)
  }

  const handleBringToken = (event: any) => {
    turnAction.current = TurnAction.BRING_TOKEN;
    const value = event.currentTarget.value;
    if (!validateBringToken(value as Token)) {
      return;
    }
    const map = new Map(tokenMap);
    map.set(value, (tokenMap.get(value) || 0) + 1);
    setTokenMap(map);
  }

  const validateBringToken = (token: Token) => {
    const tokenCount = Array.from(tokenMap.values()).reduce((acc, count) => acc + count, 0);
    if (tokenCount >= 3) {
      return false;
    }
    const existSameToken = Array.from(tokenMap.values()).some(count => count > 1);
    if (existSameToken){
      return false;
    }
    if (tokenCount === 2 && !!tokenMap.get(token)) {
      return false;
    }
    return true;
  }

  const handleReturnToken = (event: any) => {
    const value = event.currentTarget.value;
    const map = new Map(tokenMap);
    map.set(value, (tokenMap.get(value) || 0) - 1);
    setTokenMap(map);
  }

  const cardRenderer = (cardLevel: CardLevel) => {
    if (!gameState) return;

    const inBoardCards = gameState.developmentCards
      .filter(card => card.visible)
      .filter(card => card.level === cardLevel)

    const emptySlotsCount = 4 - inBoardCards.length;
    const emptySlots = Array.from({ length: emptySlotsCount }, (_, i) => (
      <div key={`empty-${cardLevel}-${i}`} className="empty-card"></div>
    ));

    return (
      <>
        <div key={`deck-${cardLevel}`} className="deck-card"></div>
        {inBoardCards.map((card) => (
          <div key={card.id} className="card">
            <span className="card-content">{card.name}</span>
          </div>
        ))}
        {emptySlots}
      </>
    );
  };


  const nobleTileRenderer = () => {
    if (!gameState) return;

    const nobleTiles = gameState.nobleTiles;
    const emptySlotsCount = 5 - nobleTiles.length;
    const emptySlots = Array.from({ length: emptySlotsCount }, (_, i) => (
      <div key={`noble-empty-${i}`} className="empty-noble-card"></div>
    ));

    return (
      <>
        {nobleTiles.map(noble => (
          <div className="noble-card" key={noble.id}>
            <span className="card-content"> {noble.name}</span>
          </div>
        ))}
        {emptySlots}
      </>
    )
  }


  const renderPlayerInfo = (player: Player, slotName: string) => {
    const cardBonusMap = calculateCardBonus(player);
    return (
      <div className="player-info">
        {player ? (
          <>
            <div className="player-name">{player.name}</div>
            <div className="player-object-container">
              <div className="player-card-area">
                {[Token.RUBY, Token.SAPPHIRE, Token.EMERALD, Token.DIAMOND, Token.ONYX, Token.GOLD].map(token => (
                  <span key={token} className={`card-token token-${token}`}>{cardBonusMap.get(token) ?? 0}</span>
                ))}
              </div>
              <div className="player-token-area">
                {[Token.RUBY, Token.SAPPHIRE, Token.EMERALD, Token.DIAMOND, Token.ONYX, Token.GOLD].map(token => (
                  <span key={token} className={`token token-${token}`}>{(player.tokens as any)[token] ?? 0}</span>
                ))}
              </div>
              <div className="player-reserved-area">
                {renderReservedCards(player)}
              </div>
            </div>
          </>
        ) : (
          <div className="empty-slot">
            <span className="empty-text">{slotName}</span>
          </div>
        )}
      </div>
    );
  };

  const renderReservedCards = (player: Player) => {
    const reservedCards = player.reservedCards;
    const emptySlotsCount = 3 - reservedCards.length;
    const emptySlots = Array.from({ length: emptySlotsCount }, (_, i) => (
      <div key={`reserved-empty-${i}`} className="empty-reserved-card"></div>
    ));

    return (
      <>
        {reservedCards.map(card => (
          <div className="reserved-card" key={card.id}>
            <span className="card-content"> {card.name}</span>
          </div>
        ))}
        {emptySlots}
      </>
    )
  }

  const renderMyInventory = () => {
    if (!player) return;
    const cardBonusMap = calculateCardBonus(player);
    return (
      <div className="my-info">
        <div className="my-object-container">
          <div className="my-card-area">
            {[Token.RUBY, Token.SAPPHIRE, Token.EMERALD, Token.DIAMOND, Token.ONYX, Token.GOLD].map(token => (
              <span key={token} className={`card-token token-${token}`}>{cardBonusMap.get(token) ?? 0}</span>
            ))}
          </div>
          <div className="my-token-area">
            {[Token.RUBY, Token.SAPPHIRE, Token.EMERALD, Token.DIAMOND, Token.ONYX, Token.GOLD].map(token => (
              <span key={token} className={`token token-${token}`}>{(player.tokens as any)[token] ?? 0}</span>
            ))}
          </div>
        </div>
        <div className="my-reserved-area">
          {renderMyReservedCards()}
        </div>
      </div>
    )
  }

  const renderMyReservedCards = () => {
    if (!player) return;
    const reservedCards = player.reservedCards;
    const emptySlotsCount = 3 - reservedCards.length;
    const emptySlots = Array.from({ length: emptySlotsCount }, (_, i) => (
      <div key={`my-reserved-empty-${i}`} className="my-empty-reserved-card"></div>
    ));

    return (
      <>
        {reservedCards.map(card => (
          <div className="my-reserved-card" key={card.id}>
            <span className="card-content"> {card.name}</span>
          </div>
        ))}
        {emptySlots}
      </>
    )
  }

  const calculateCardBonus = (player: Player) => {
    const map = new Map<Token, number>();
    player?.developmentCards?.forEach(card => {
      const bonus = card.token;
      map.set(bonus, (map.get(bonus) ?? 0) + 1);
    })
    return map;
  }

  const calculatePlayerTokenCount = () => {
    if (!player) return 0;
    return Object.entries(player?.tokens).reduce((acc, [, count]) => acc + count, 0) ?? 0;
  }

  if (!gameRoom || !gameState) {
    return <div>게임 방에 연결하는 중입니다...</div>;
  }

  return (
    <div className="game-container">
      <div className="game-top">
        <div className="player-area left-area">
          <div className="top-ui-container logo-container">
            <h1 className="game-logo">Nyangplendor</h1>
          </div>
          <div className="player-slots">
            {renderPlayerInfo(gameState.players[0], 'Player 1')}
            {renderPlayerInfo(gameState.players[2], 'Player 3')}
          </div>
        </div>
        <div className="board-area">
          <div className="board">
            <div className="token-column-side">
              {[Token.RUBY, Token.SAPPHIRE, Token.EMERALD, Token.DIAMOND, Token.ONYX, Token.GOLD].map(token => (
                <div className="token-row" key={token}>
                  <button
                    value={token}
                    className={`token-stack token-${token}`}
                    onClick={handleBringToken}
                  >
                    <img src={tokenImages[token]} alt={`${token} 토큰`} className="token-image" />
                  </button>
                  <span className="token-count">{(gameState.tokens[token] ?? 0) - (tokenMap.get(token) ?? 0)}</span>
                </div>
              ))}
            </div>

            <div className="development-column-side">
              {[CardLevel.LEVEL3, CardLevel.LEVEL2, CardLevel.LEVEL1].map(level => (
                <div key={level} className="card-level">
                  <div className="card-row">{cardRenderer(level)}</div>
                </div>
              ))}
            </div>

            <div className="noble-column-side">
              {nobleTileRenderer()}
            </div>
          </div>
        </div>

        <div className="player-area right-area">
          <div className="top-ui-container button-container">
            { gameState?.phase === GamePhase.WAITING_FOR_PLAYERS ?
              <button onClick={handleStartGame} className="bubbly" disabled={disableStartButton}>
                게임 시작
              </button>
              :
              <button onClick={handleEndTurn} className="bubbly" disabled={disableTurnEndButton}>
                턴 종료
              </button>
            }
          </div>
          <div className="player-slots">
            {renderPlayerInfo(gameState.players[1], 'Player 2')}
            {renderPlayerInfo(gameState.players[3], 'Player 4')}
          </div>
        </div>
      </div>

      <div className="game-bottom">
        <div className="temp-inventory">
          {[...tokenMap.entries()].map(([token, count]) =>
            [...Array(count)].map((_, i) => (
                <button
                  key={`${token}-${i}`}
                  value={token}
                  className={`temp-token token-${token}`}
                  onClick={handleReturnToken}
                >
                  <img src={tokenImages[token]} alt={`${token} 토큰`} className="token-image" />
                </button>
            ))
          )}
        </div>

        <div className="bottom-center">
          <span className="owned-token-count">{calculatePlayerTokenCount()} / 10</span>
          <div className="owned-objects">
            {renderMyInventory()}
          </div>
        </div>

        <div className="turn-time">
          남은 시간: 30
        </div>
      </div>
    </div>
  );

}
