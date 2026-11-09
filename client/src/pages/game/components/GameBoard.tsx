import {CardLevel, Token} from "@shared/types/enums/GameObject";
import {TurnAction} from "@shared/types/enums/Action";
import {DevelopmentCardStack, DevelopmentCardView, NobleTileView, tokenImages} from "@/pages";
import type {Dispatch, MouseEvent, SetStateAction} from "react";
import type {GameState} from "@shared/states/GameState";
import type {DevelopmentCard} from "@shared/models/colyseus/DevelopmentCard";
import {AllTokens} from "@shared/utils/tokens";
import type {NobleTile} from "@shared/models/colyseus/NobleTile";
import type {TurnActionType} from "@/hooks";
import {clsx} from "clsx";
import {tokenColorClasses} from "@/styles/style.ts";

interface Props {
  gameState: ReturnType<GameState['toJSON']>;
  turnActionInfo: TurnActionType;
  pendingTokens: Record<Token, number>;
  bringToken: (event: MouseEvent<HTMLButtonElement>) => void;
  setSelectedCard: Dispatch<SetStateAction<DevelopmentCard | null>>;
  setSelectedNobleTile: Dispatch<SetStateAction<NobleTile | null>>;
}

export const GameBoard = ({
                            gameState,
                            turnActionInfo,
                            pendingTokens,
                            bringToken,
                            setSelectedCard,
                            setSelectedNobleTile }: Props) => {
  //
  const tokenRenderer = () => {
    //
    return (
      AllTokens.map(token => {
        const remainingCount = (gameState.tokens[token] ?? 0) - pendingTokens[token as Token];
        const isEmpty = remainingCount <= 0;

        return (
          <div className="center [perspective:500px] w-full" key={token}>
            <button
              value={token}
              className={clsx(
                "board-token-size rounded-full border-3 relative center token-animation token-animation:active token-animation:hover cursor-pointer",
                tokenColorClasses[token],
                isEmpty && "opacity-40 grayscale cursor-not-allowed"
              )}
              onClick={bringToken}
            >
              <span className="absolute inset-1 rounded-full border border-dashed border-white/70 pointer-events-none" />
              <img
                src={tokenImages[token]}
                alt={token}
                className="w-[68%] h-[68%] rounded-full object-contain drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)] pointer-events-none relative z-10 [transform:translateZ(1px)]"
              />
              <span
                className={clsx(
                  "absolute -bottom-1 -right-1 min-w-6 h-6 px-1 rounded-full border-2 border-white center text-xs lg:text-sm font-extrabold shadow-md z-20 pointer-events-none",
                  isEmpty ? "bg-gray-600 text-gray-200" : "bg-coffee text-white"
                )}
              >
                {remainingCount}
              </span>
            </button>
          </div>
        );
      })
    )
  }

  const cardRenderer = () => {
    //
    return [CardLevel.LEVEL3, CardLevel.LEVEL2, CardLevel.LEVEL1].map(cardLevel => {
      const levelCards = gameState.developmentCards.filter(card => card.level === cardLevel);
      const inDeckCards = levelCards.filter(card => !card.visible);
      const inBoardCards = levelCards.filter(card => card.visible);

      const totalCards = levelCards.length;
      const deckCards = inDeckCards.length;
      const ratio = deckCards / totalCards;
      const numberOfLayers = deckCards === 0 ? 0 : Math.max(1, Math.round(ratio * 5));

      const topDeckCard = inDeckCards[0];
      const isDeckPendingReserve =
        !!topDeckCard &&
        turnActionInfo.action === TurnAction.RESERVE_DEVELOPMENT_CARD &&
        turnActionInfo.card?.id === topDeckCard.id;

      return (
        <div key={cardLevel} className="flex gap-2 lg:gap-1">
          <div
            key={`deck-${cardLevel}`}
            className={clsx(
              "relative board-card-size bg-secondary border border-dashed border-ui-border shrink-0",
              topDeckCard && "cursor-pointer",
              isDeckPendingReserve && "grayscale-[80%] brightness-70"
            )}
            style={{ borderRadius: 'var(--radius-sm)' }}
            onClick={() => topDeckCard && setSelectedCard(topDeckCard)}
          >
            <DevelopmentCardStack numberOfLayers={numberOfLayers} />
            {isDeckPendingReserve && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none z-20" style={{ borderRadius: 'var(--radius-sm)' }}>
                <div className="absolute top-10 -left-7 w-35 lg:top-16 lg:-left-10 lg:w-50 py-1 lg:py-1.5 text-center font-bold text-[0.8em] lg:text-[0.9em] tracking-wider -rotate-35 origin-center shadow-md bg-warning text-gray-800">
                  Reserved
                </div>
              </div>
            )}
          </div>
          { inBoardCards.map((card) => (
            <div key={card.id} className="board-card-size bg-secondary shadow-sm shrink-0 cursor-pointer" style={{ borderRadius: 'var(--radius-sm)' }} onClick={() => setSelectedCard(card)}>
              <DevelopmentCardView cardInfo={card} turnActionInfo={turnActionInfo} />
            </div>
          )) }
          { Array.from({ length: 4 - inBoardCards.length }, (_, i) => (
            <div key={`empty-${cardLevel}-${i}`} className="board-card-size bg-primay border border-dashed border-ui-border shrink-0" style={{ borderRadius: 'var(--radius-sm)' }}></div>
          )) }
        </div>
      )
    })
  };

  const nobleTileRenderer = () => {
    //
    const nobleTiles = gameState.nobleTiles;
    return (
      <div className="flex flex-col items-center gap-2 [perspective:500px]">
        { nobleTiles.map(nobleTile => (
          <div className="board-tile-size center bg-secondary font-bold shadow-sm shrink-0" style={{ borderRadius: 'var(--radius-sm)' }} key={nobleTile.id} onClick={() => setSelectedNobleTile(nobleTile)}>
            <NobleTileView nobleTile={nobleTile} />
          </div>
        )) }
        { Array.from({ length: 5 - nobleTiles.length }, (_, i) => (
          <div key={`noble-empty-${i}`} className="board-tile-size bg-primary border border-dashed border-ui-border shrink-0" style={{ borderRadius: 'var(--radius-sm)' }}></div>
        )) }
      </div>
    )
  }

  return (
    <>
      <div className="container center gap padding">
        <article className="flex flex-col gap-4 items-center flex-1 w-auto">
          { tokenRenderer() }
        </article>

        <article className="flex flex-col gap-2.5 items-center flex-[4]">
          { cardRenderer() }
        </article>

        <article className="center flex-col gap-4 flex-1 w-auto">
          { nobleTileRenderer() }
        </article>
      </div>
    </>
  )
}