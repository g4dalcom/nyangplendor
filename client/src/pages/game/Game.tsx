import {useEffect, useRef, useState} from "react"
import {useNavigate} from "react-router-dom";
import {useGameRoom} from "@/contexts";
import {useTurnGuard} from "@/hooks";
import {CardDetailModal, GameBoard, Inventory, NobleTileDetailModal, PlayerInfo} from "@/pages";
import {GamePhase, Token, Transfer, TurnAction} from "@shared/types/index";
import type {DevelopmentCard} from "@shared/models/colyseus/DevelopmentCard";

import "./Game.css";
import rubyToken from "@/assets/icons/churu.svg";
import sapphireToken from "@/assets/icons/tuna.svg";
import emeraldToken from "@/assets/icons/fishing-toy.svg";
import diamondToken from "@/assets/icons/yarn-ball.svg";
import onyxToken from "@/assets/icons/fish.svg";
import goldToken from "@/assets/icons/gold.svg";
import type {NobleTile} from "@shared/models/colyseus/NobleTile";

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
  const navigate = useNavigate();
  const { gameRoom, gameState, player } = useGameRoom();
  const turnGuard = useTurnGuard(player?.turn ?? false);

  const [selectedTokens, setSelectedTokens] = useState<Map<Token, number>>(new Map());
  const [selectedCard, setSelectedCard] = useState<DevelopmentCard | null>(null);
  const [selectedNobleTile, setSelectedNobleTile] = useState<NobleTile | null>(null);
  const [cardDetailModalOpen, setCardDetailModalOpen] = useState<boolean>(false);
  const [nobleTileDetailModalOpen, setNobleTileDetailModalOpen] = useState<boolean>(false);
  const turnAction = useRef<TurnAction>(TurnAction.NO_ACTION);

  // TODO: TEST 후 롤백
  // const disableStartButton = !player?.host || gameState!.players.length < 2;
  const disableStartButton = false;
  const disableTurnEndButton = !player?.turn;

  useEffect(() => {
    if (!gameRoom || !gameState) {
      navigate("/");
    }
  }, [gameRoom, gameState, navigate]);

  useEffect(() => {
    setSelectedTokens(new Map());
    setSelectedCard(null);
    setSelectedNobleTile(null);
    turnAction.current = TurnAction.NO_ACTION;
  }, [gameState?.turn]);

  useEffect(() => {
    if (selectedCard) {
      setCardDetailModalOpen(true);
    } else {
      setCardDetailModalOpen(false);
    }
  }, [selectedCard]);

  useEffect(() => {
    if (selectedNobleTile) {
      setNobleTileDetailModalOpen(true);
    } else {
      setNobleTileDetailModalOpen(false);
    }
  }, [selectedNobleTile]);

  const handleStartGame = () => {
    gameRoom?.send(Transfer.START_GAME)
    console.log("Game Start = ", gameRoom?.state)
  };

  const handleEndTurn = turnGuard(() => {
    let messageType = Transfer.NO_ACTION;

    switch (turnAction.current) {
      case TurnAction.BRING_TOKEN:
        messageType = Transfer.ACTION_BRING_TOKEN;
        break;
    }
    gameRoom?.send(messageType, { selectedTokens })
    console.log("End Turn = ", gameRoom?.state)
  })

  const handleBringToken = turnGuard((event: any) => {
    turnAction.current = TurnAction.BRING_TOKEN;
    const value = event.currentTarget.value;
    if (!validateBringToken(value as Token)) {
      return;
    }
    const map = new Map(selectedTokens);
    map.set(value, (selectedTokens.get(value) || 0) + 1);
    setSelectedTokens(map);
  })

  const validateBringToken = (token: Token) => {
    const tokenCount = Array.from(selectedTokens.values()).reduce((acc, count) => acc + count, 0);
    if (tokenCount >= 3) {
      return false;
    }
    const existSameToken = Array.from(selectedTokens.values()).some(count => count > 1);
    if (existSameToken){
      return false;
    }
    if (tokenCount === 2 && !!selectedTokens.get(token)) {
      return false;
    }
    return true;
  }

  const handleReturnToken = turnGuard((event: any) => {
    const value = event.currentTarget.value;
    const map = new Map(selectedTokens);
    map.set(value, (selectedTokens.get(value) || 0) - 1);
    setSelectedTokens(map);
  })

  if (!gameRoom || !gameState) {
    return <div>방을 찾는 중...</div>;
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
          selectedTokens={selectedTokens}
          handleBringToken={handleBringToken}
          setSelectedCard={setSelectedCard}
          setSelectedNobleTile={setSelectedNobleTile}
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
        selectedTokens={selectedTokens}
        handleReturnToken={handleReturnToken}
      />

      {/* Modals */}
      { selectedCard && cardDetailModalOpen &&
        <CardDetailModal
          selectedCard={selectedCard}
          cardDetailModalOpen={cardDetailModalOpen}
          closeModal={() => {
            setCardDetailModalOpen(false)
            setSelectedCard(null)
          }}
        />
      }

      { selectedNobleTile && nobleTileDetailModalOpen &&
        <NobleTileDetailModal
          selectedNobleTile={selectedNobleTile}
          nobleTileDetailModalOpen={nobleTileDetailModalOpen}
          closeModal={() => {
            setNobleTileDetailModalOpen(false)
            setSelectedNobleTile(null)
          }}
        />
      }
    </div>
  );
}
