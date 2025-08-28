import {useEffect, useRef, useState} from "react"
import {CardLevel, GamePhase, Token, Transfer, TurnAction} from "@shared/types";
import {useGameRoom} from "@/contexts";
import type {Player} from "@shared/models/colyseus/Player";
import "./Game.css";

export const Game = () => {
  //
  const { gameRoom, gameState, player } = useGameRoom();
  const [tokenMap, setTokenMap] = useState<Map<Token, number>>(new Map());
  const turnAction = useRef<TurnAction>(TurnAction.NO_ACTION);
  const disableStartButton = !player?.host || gameState!.players.length < 2 || gameState?.phase !== GamePhase.WAITING_FOR_PLAYERS;

  useEffect(() => {
    if (!gameRoom || !gameState || !player) return;

    gameRoom.onMessage(Transfer.START_GAME, (payload: any) => {
      alert(payload.message);
    });
  }, [gameRoom, player]);

  const handleStartGame = () => {
    gameRoom?.send(Transfer.START_GAME)
    console.log("start state = ", gameRoom?.state)
  };

  const handleEndTurn = () => {
    let messageType = Transfer.NO_ACTION;

    console.log("turnAction = ", turnAction.current)
    switch (turnAction.current) {
      case TurnAction.BRING_TOKEN:
        messageType = Transfer.BRING_TOKEN;
        break;
    }
    gameRoom?.send(messageType, { playerId: player?.id, tokenMap: tokenMap })
    console.log("End Turn State = ", gameRoom?.state)
  }

  const handleBringToken = (event: any) => {
    turnAction.current = TurnAction.BRING_TOKEN;
    const value = event.target.value;
    const map = tokenMap;
    map.set(value, (tokenMap.get(value) || 0) + 1);
    setTokenMap(map);
  }

  const cardRenderer = (cardLevel: CardLevel) => {
    if (!gameRoom?.state) return;

    const inBoardCards = gameRoom.state.developmentCards
      .filter(card => card.visible)
      .filter(card => card.level === cardLevel)

    const emptySlotsCount = 4 - inBoardCards.length;
    const emptySlots = Array.from({ length: emptySlotsCount }, (_, i) => (
      <div key={`empty-${cardLevel}-${i}`} className="empty-card"></div>
    ));

    return (
      <>
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
    if (!gameRoom?.state) return;

    const nobleTiles = gameRoom.state.nobleTiles;
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
    return (
      <div className="player-info">
        {player ? (
          <h3>{player.name}</h3>
        ) : (
          <div className="empty-slot">
            <span className="empty-text">{slotName}</span>
          </div>
        )}
      </div>
    );
  };

  if (!gameRoom || !gameState) {
    return <div>게임 방에 연결하는 중입니다...</div>;
  }

  return (
    <div className="game-container">
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
          <div className="token-side">
            <div className="token-area">
              <div className="token-column">
                {[Token.RUBY, Token.SAPPHIRE, Token.EMERALD, Token.DIAMOND, Token.ONYX, Token.GOLD].map(token => (
                  <button
                    key={token}
                    value={token}
                    className={`token token-${token}`}
                    onClick={handleBringToken}
                  ></button>
                ))}
              </div>
            </div>
          </div>

          <div className="card-side">
            <div className="nobles-area">
              <div className="noble-row">
                {nobleTileRenderer()}
              </div>
            </div>

            <div className="cards-area">
              {[CardLevel.LEVEL3, CardLevel.LEVEL2, CardLevel.LEVEL1].map(level => (
                <div key={level} className={`card-level level${level}`}>
                  <div className="card-stack-back"></div>
                  <div className="card-row">
                    {cardRenderer(level)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="player-area right-area">
        <div className="top-ui-container button-container">
          <button onClick={handleStartGame} className="start-game-btn" disabled={disableStartButton}>
            게임 시작
          </button>
          <button onClick={handleEndTurn} className="end-turn-btn">
            턴 종료
          </button>
        </div>
        <div className="player-slots">
          {renderPlayerInfo(gameState.players[1], 'Player 2')}
          {renderPlayerInfo(gameState.players[3], 'Player 4')}
        </div>
      </div>
    </div>
  );
}
