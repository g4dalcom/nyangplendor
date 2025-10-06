import {CardLevel, Token} from "@shared/types/enums/GameObject";
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
      AllTokens.map(token => (
        <div className="center gap [perspective:500px] w-full" key={token}>
          <button value={token} className={clsx("board-token-size rounded-full border-[3px] border-[#222] relative token-animation token-animation:active token-animation:hover", tokenColorClasses[token])} onClick={bringToken}>
            <img src={tokenImages[token]} alt={token} className="w-full h-full rounded-full object-cover pointer-events-none relative z-10 [transform:translateZ(1px)]" />
          </button>
          <span className="text-lg lg:text-xl font-bold text-coffee px-3 py-1 text-center">{(gameState.tokens[token] ?? 0) - pendingTokens[token as Token]}</span>
        </div>
      ))
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

      return (
        <div key={cardLevel} className="flex gap-2 lg:gap-1">
          <div key={`deck-${cardLevel}`} className="relative board-card-size rounded-lg bg-secondary border border-dashed border-[#999] shrink-0">
            <DevelopmentCardStack numberOfLayers={numberOfLayers} />
          </div>
          { inBoardCards.map((card) => (
            <div key={card.id} className="board-card-size rounded-lg bg-secondary shadow-sm shrink-0 cursor-pointer" onClick={() => setSelectedCard(card)}>
              <DevelopmentCardView cardInfo={card} turnActionInfo={turnActionInfo} />
            </div>
          )) }
          { Array.from({ length: 4 - inBoardCards.length }, (_, i) => (
            <div key={`empty-${cardLevel}-${i}`} className="board-card-size rounded-lg bg-primay border border-dashed border-[#999] shrink-0"></div>
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
          <div className="board-tile-size center bg-secondary rounded-lg font-bold shadow-sm shrink-0" key={nobleTile.id} onClick={() => setSelectedNobleTile(nobleTile)}>
            <NobleTileView nobleTile={nobleTile} />
          </div>
        )) }
        { Array.from({ length: 5 - nobleTiles.length }, (_, i) => (
          <div key={`noble-empty-${i}`} className="board-tile-size bg-primary rounded-lg border border-dashed border-[#999] shrink-0"></div>
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