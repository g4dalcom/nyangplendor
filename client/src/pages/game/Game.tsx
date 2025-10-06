import {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom";
import {useDialog, useGameRoom} from "@/contexts";
import {useTurnAction, useTurnGuard} from "@/hooks";
import {DevelopmentCardDetailModal, GameBoard, GamePlayer, NobleTileDetailModal, PlayerHand} from "@/pages";
import {Token, Transfer, TurnAction} from "@shared/types/index";
import type {DevelopmentCard} from "@shared/models/colyseus/DevelopmentCard";
import type {NobleTile} from "@shared/models/colyseus/NobleTile";
import {convertMapSchemaToRecord, getTotalTokens} from "@shared/utils/tokens";
import rubyToken from "@/assets/icons/churu.svg";
import sapphireToken from "@/assets/icons/tuna.svg";
import emeraldToken from "@/assets/icons/fishing-toy.svg";
import diamondToken from "@/assets/icons/yarn-ball.svg";
import onyxToken from "@/assets/icons/fish.svg";
import goldToken from "@/assets/icons/gold.svg";
import {Toast} from "@/ui";
import logo from "@/assets/images/logo.png";

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
  const { alert } = useDialog();
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

  const handleEndTurn = turnGuard(async () => {
    if (!await validateEndTurn()) {
      alert("You have to return tokens less than 10.");
      return;
    }

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

  const bringToken = turnGuard(async (event: any) => {
    const value = event.currentTarget.value;
    if (!await validateBringToken(value as Token)) {
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

  const validateBringToken = async (token: Token) => {
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

  const validateEndTurn = async () => {
    if (player?.tokens) {
      return getTotalTokens(convertMapSchemaToRecord(player?.tokens)) <= 10;
    }
    return false;
  }

  return (
    <>
      <section className="grid grid-rows-[4fr_1fr] h-full">
        <section className="grid grid-cols-[1fr_4fr_1fr]">
          {/* Left Players */}
          <section className="grid grid-row-2 center">
              <GamePlayer player={gameState.players[0]} setSelectedCard={setSelectedCard} />
              <GamePlayer player={gameState.players[2]} setSelectedCard={setSelectedCard} />
          </section>

          <section className="center">
            <GameBoard
              gameState={gameState}
              turnActionInfo={turnActionInfo}
              pendingTokens={turnActionInfo.tokens}
              bringToken={bringToken}
              setSelectedCard={setSelectedCard}
              setSelectedNobleTile={setSelectedNobleTile}
            />
          </section>

          {/* Right Players */}
          <section className="grid grid-row-[1fr_1fr] center">
            <GamePlayer player={gameState.players[1]} setSelectedCard={setSelectedCard} />
            <GamePlayer player={gameState.players[3]} setSelectedCard={setSelectedCard} />
          </section>
        </section>

        <section className="grid grid-cols-[1fr_3fr_1fr] place-items-center gap">
          <PlayerHand
            player={player}
            pendingTokens={turnActionInfo.tokens}
            undoBringToken={undoBringToken}
            gamePhase={gameState?.phase}
            disableStartButton={disableStartButton}
            disableTurnEndButton={disableTurnEndButton}
            handleStartGame={handleStartGame}
            handleEndTurn={handleEndTurn}
            setSelectedCard={setSelectedCard}
          />

          <article className="center">
            <img className="h-full object-contain max-w-[10rem] lg:max-w-[12rem]" src={logo} alt="Nyangplendor Logo" />
          </article>
        </section>

        { selectedCard &&
          <DevelopmentCardDetailModal
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

        <Toast />

      </section>
    </>
  );
}
