import "./GameBoard.css";
import {CardLevel, Token} from "@shared/types/enums/GameObject";
import {tokenImages} from "@/pages";
import type {MouseEvent} from "react";
import type {GameState} from "@shared/states/GameState";

interface Props {
  gameState: ReturnType<GameState['toJSON']>;
  tokenMap: Map<Token, number>;
  handleBringToken: (event: MouseEvent<HTMLButtonElement>) => void;
}

export const GameBoard = ({ gameState, tokenMap, handleBringToken }: Props) => {
  //
  const tokenRenderer = () => {
    //
    return (
        [Token.RUBY, Token.SAPPHIRE, Token.EMERALD, Token.DIAMOND, Token.ONYX, Token.GOLD].map(token => (
        <div className="board-token-row" key={token}>
          <button value={token} className={`board-token-stack token-${token}`} onClick={handleBringToken}>
            <img src={tokenImages[token]} alt={`${token} 토큰`} className="token-image" />
          </button>
          <span className="token-count">{(gameState.tokens[token] ?? 0) - (tokenMap.get(token) ?? 0)}</span>
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
              <div key={card.id} className="board-card">
                <span className="card-content">{card.name}</span>
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
        { nobleTiles.map(noble => (
          <div className="board-noble-card" key={noble.id}>
            <span className="card-content"> {noble.name}</span>
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