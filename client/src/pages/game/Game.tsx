import {useEffect, useRef, useState} from "react"
import {GamePhase, Token, Transfer, TurnAction} from "@shared/types/index";
import {useGameRoom} from "@/contexts";
import "./Game.css";
import {PlayerInfo} from "@/pages/game/components/PlayerInfo.tsx";

import rubyToken from "@/assets/icons/churu.svg";
import sapphireToken from "@/assets/icons/tuna.svg";
import emeraldToken from "@/assets/icons/fishing-toy.svg";
import diamondToken from "@/assets/icons/yarn-ball.svg";
import onyxToken from "@/assets/icons/fish.svg";
import goldToken from "@/assets/icons/gold.svg";
import {Inventory} from "@/pages/game/components/Inventory.tsx";
import {GameBoard} from "@/pages/game/components/GameBoard.tsx";
import {useTurnGuard} from "@/hooks";

export const tokenImages = {
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
  const turnGuard = useTurnGuard(player?.turn ?? false);
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

  const handleEndTurn = turnGuard(() => {
    let messageType = Transfer.NO_ACTION;

    switch (turnAction.current) {
      case TurnAction.BRING_TOKEN:
        messageType = Transfer.BRING_TOKEN;
        break;
    }
    gameRoom?.send(messageType, { tokenMap })
    console.log("End Turn = ", gameRoom?.state)
  })

  const handleBringToken = turnGuard((event: any) => {
    turnAction.current = TurnAction.BRING_TOKEN;
    const value = event.currentTarget.value;
    if (!validateBringToken(value as Token)) {
      return;
    }
    const map = new Map(tokenMap);
    map.set(value, (tokenMap.get(value) || 0) + 1);
    setTokenMap(map);
  })

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

  const handleReturnToken = turnGuard((event: any) => {
    const value = event.currentTarget.value;
    const map = new Map(tokenMap);
    map.set(value, (tokenMap.get(value) || 0) - 1);
    setTokenMap(map);
  })

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
            <PlayerInfo player={gameState.players[0]} />
            <PlayerInfo player={gameState.players[2]} />
          </div>
        </div>
        {/* Game Board */}
        <GameBoard
          gameState={gameState}
          tokenMap={tokenMap}
          handleBringToken={handleBringToken}
        />

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
            <PlayerInfo player={gameState.players[1]} />
            <PlayerInfo player={gameState.players[3]} />
          </div>
        </div>
      </div>

      {/* Bottom UI */}
      <Inventory
        player={player}
        tokenMap={tokenMap}
        handleReturnToken={handleReturnToken}
      />
    </div>
  );

}
