import {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom";
import {useGameRoom} from "@/contexts";
import {useTurnAction, useTurnGuard} from "@/hooks";
import {CardDetailModal, GameBoard, GamePlayer, NobleTileDetailModal, PlayerHand} from "@/pages";
import {GamePhase, Token, Transfer, TurnAction} from "@shared/types/index";
import type {DevelopmentCard} from "@shared/models/colyseus/DevelopmentCard";
import type {NobleTile} from "@shared/models/colyseus/NobleTile";
import {getTotalTokens} from "@shared/utils/tokens";
import "./Game.css";
import rubyToken from "@/assets/icons/churu.svg";
import sapphireToken from "@/assets/icons/tuna.svg";
import emeraldToken from "@/assets/icons/fishing-toy.svg";
import diamondToken from "@/assets/icons/yarn-ball.svg";
import onyxToken from "@/assets/icons/fish.svg";
import goldToken from "@/assets/icons/gold.svg";

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
  const { turnActionInfo, resetActionInfo, updateWithTokens, updateWithCard } = useTurnAction();
  const turnGuard = useTurnGuard(player?.turn ?? false);

  const [selectedCard, setSelectedCard] = useState<DevelopmentCard | null>(null);
  const [selectedNobleTile, setSelectedNobleTile] = useState<NobleTile | null>(null);

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
    resetActionInfo();
  }, [gameState?.turn]);

  const handleStartGame = () => {
    gameRoom?.send(Transfer.START_GAME)
    console.log("Game Start = ", gameRoom?.state)
  };

  const handleEndTurn = turnGuard(() => {
    let messageType = Transfer.NO_ACTION;
    let params = undefined;

    switch (turnActionInfo.action) {
      case TurnAction.BRING_TOKEN:
        messageType = Transfer.ACTION_BRING_TOKEN;
        params = turnActionInfo.tokens;
        break;
      case TurnAction.PURCHASE_DEVELOPMENT_CARD:
        messageType = Transfer.ACTION_PURCHASE_DEVELOPMENT_CARD;
        params = turnActionInfo.card?.id;
        break;
      case TurnAction.RESERVE_DEVELOPMENT_CARD:
        messageType = Transfer.ACTION_RESERVE_DEVELOPMENT_CARD;
        params = turnActionInfo.card?.id;
        break;
    }
    gameRoom?.send(messageType, { params })
    console.log("End Turn = ", gameRoom?.state)
  })

  const bringToken = turnGuard((event: any) => {
    const value = event.currentTarget.value;
    if (!validateBringToken(value as Token)) {
      return;
    }
    const tokens = { ... turnActionInfo.tokens };
    tokens[value as Token] += 1;
    updateWithTokens(tokens);
  })

  const undoBringToken = turnGuard((event: any) => {
    const value = event.currentTarget.value;
    const tokens = { ... turnActionInfo.tokens };
    tokens[value as Token] -= 1;
    updateWithTokens(tokens);
  })

  const purchaseCard = turnGuard(() => {
    if (selectedCard) {
      updateWithCard(TurnAction.PURCHASE_DEVELOPMENT_CARD, selectedCard)
      setSelectedCard(null);
    }
  })

  const reserveCard = turnGuard(() => {
    if (selectedCard) {
      updateWithCard(TurnAction.RESERVE_DEVELOPMENT_CARD, selectedCard)
      setSelectedCard(null);
    }
  })

  const validateBringToken = (token: Token) => {
    const bringTokens = turnActionInfo.tokens;
    const tokenCount = getTotalTokens(bringTokens);
    if (tokenCount >= 3) {
      return false;
    }
    const existSameToken = Object.values(bringTokens).some(count => count > 1);
    if (existSameToken){
      return false;
    }
    if (tokenCount === 2 && bringTokens[token] > 0) {
      return false;
    }
    return true;
  }

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
            <GamePlayer player={gameState.players[0]} />
            <GamePlayer player={gameState.players[2]} />
          </div>
        </div>
        {/* Game Board */}
        <GameBoard
          gameState={gameState}
          pendingTokens={turnActionInfo.tokens}
          bringToken={bringToken}
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
            <GamePlayer player={gameState.players[1]} />
            <GamePlayer player={gameState.players[3]} />
          </div>
        </div>
      </div>

      {/* Bottom UI */}
      <PlayerHand
        player={player}
        pendingTokens={turnActionInfo.tokens}
        undoBringToken={undoBringToken}
      />

      {/* Modals */}
      { selectedCard &&
        <CardDetailModal
          selectedCard={selectedCard}
          closeModal={() => setSelectedCard(null)}
          handleClickPurchase={purchaseCard}
          handleClickReserve={reserveCard}
        />
      }

      { selectedNobleTile &&
        <NobleTileDetailModal
          selectedNobleTile={selectedNobleTile}
          closeModal={() => setSelectedNobleTile(null)}
        />
      }
    </div>
  );
}
