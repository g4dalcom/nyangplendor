import "./GameBoard.css";
import {CardLevel, Token} from "@shared/types/enums/GameObject";
import {DevelopmentCardView, NobleTileView, tokenImages} from "@/pages";
import type {Dispatch, MouseEvent, SetStateAction} from "react";
import type {GameState} from "@shared/states/GameState";
import type {DevelopmentCard} from "@shared/models/colyseus/DevelopmentCard";
import {AllTokens} from "@shared/utils/tokens";
import type {NobleTile} from "@shared/models/colyseus/NobleTile";

interface Props {
  gameState: ReturnType<GameState['toJSON']>;
  selectedTokens: Map<Token, number>;
  handleBringToken: (event: MouseEvent<HTMLButtonElement>) => void;
  setSelectedCard: Dispatch<SetStateAction<DevelopmentCard | null>>;
  setSelectedNobleTile: Dispatch<SetStateAction<NobleTile | null>>;
}

export const GameBoard = ({
                            gameState,
                            selectedTokens,
                            handleBringToken,
                            setSelectedCard,
                            setSelectedNobleTile }: Props) => {
  //
  const tokenRenderer = () => {
    //
    return (
        AllTokens.map(token => (
        <div className="board-token-row" key={token}>
          <button value={token} className={`board-token-stack token-${token}`} onClick={handleBringToken}>
            <img src={tokenImages[token]} alt={`${token} 토큰`} className="token-image" />
          </button>
          <span className="token-count">{(gameState.tokens[token] ?? 0) - (selectedTokens.get(token) ?? 0)}</span>
        </div>
      ))
    )
  }

  const cardRenderer = () => {
    //
    return [CardLevel.LEVEL3, CardLevel.LEVEL2, CardLevel.LEVEL1].map(cardLevel => {
      const inBoardCards = gameState.developmentCards
        .filter(card => card.visible)
        .filter(card => card.level === cardLevel)

      return (
        <div key={cardLevel} className="card-level">
          <div className="board-card-row">
            <div key={`deck-${cardLevel}`} className="deck-card"></div>
            { inBoardCards.map((card) => (
              <div key={card.id} className="board-card" onClick={() => setSelectedCard(card)}>
                <DevelopmentCardView cardInfo={card} />
              </div>
            )) }
            { Array.from({ length: 4 - inBoardCards.length }, (_, i) => (
              <div key={`empty-${cardLevel}-${i}`} className="empty-card"></div>
            )) }
          </div>
        </div>
      )
    })
  };

  const nobleTileRenderer = () => {
    //
    const nobleTiles = gameState.nobleTiles;
    return (
      <div className="board-noble-row">
        { nobleTiles.map(nobleTile => (
          <div className="board-noble-card" key={nobleTile.id} onClick={() => setSelectedNobleTile(nobleTile)}>
            <NobleTileView nobleTile={nobleTile} />
          </div>
        )) }
        { Array.from({ length: 5 - nobleTiles.length }, (_, i) => (
          <div key={`noble-empty-${i}`} className="empty-noble-card"></div>
        )) }
      </div>
    )
  }

  return (
    <section className="game-board-container">
      <div className="game-board">
        <article className="board-token-area">
          { tokenRenderer() }
        </article>

        <article className="board-card-area">
          { cardRenderer() }
        </article>

        <article className="board-noble-area">
          { nobleTileRenderer() }
        </article>
      </div>
    </section>
  )
}