import "./Inventory.css";
import {Token} from "@shared/types/enums/GameObject";
import {tokenImages} from "@/pages";
import type {Player} from "@shared/models/colyseus/Player";
import {type MouseEvent, useEffect, useState} from "react";
import {AllTokens, TokensWithoutGold} from "@shared/utils/tokens";

interface Props {
  player: Player | null | undefined;
  selectedTokens: Map<Token, number>;
  handleReturnToken: (event: MouseEvent<HTMLButtonElement>) => void;
}

export const Inventory = ({
                            player,
                            selectedTokens,
                            handleReturnToken
}: Props) => {
  //
  const [cardBonusMap, setCardBonusMap] = useState<Map<Token, number>>(new Map());
  const emptySlotCount = 3 - (player?.reservedCards.length ?? 0);

  useEffect(() => {
    if (player) {
      calculateCardBonus(player)
    }
  }, [player?.developmentCards]);


  const calculateCardBonus = (player: Player) => {
    const map = new Map<Token, number>();
    for (const card of player.developmentCards) {
      const bonus = card.token;
      map.set(bonus, (map.get(bonus) ?? 0) + 1);
    }
    setCardBonusMap(map)
  }

  const calculatePlayerTokenCount = () => {
    if (!player) return 0;
    return Object.entries(player?.tokens).reduce((acc, [, count]) => acc + count, 0) ?? 0;
  }

  return (
    <section className="my-inventory-container">
      {/* Bring Token Area */}
      <article className="left-inventory-area">
        <div className="bring-token-area">
        { [...selectedTokens.entries()].map(([token, count]) =>
          [...Array(count)].map((_, i) => (
            <button
              key={`${token}-${i}`}
              value={token}
              className={`bring-token token-${token}`}
              onClick={handleReturnToken}
            >
              <img src={tokenImages[token]} alt={`${token} 토큰`} className="token-image" />
            </button>
          ))
        ) }
        </div>
      </article>

      {/* My Object Inventory */}
      <article className="center-inventory-area">
        <span className="my-token-count">{calculatePlayerTokenCount()} / 10</span>
        <div className="my-object-container">
          <div className="my-info-left">
            <div className="my-card-area">
              { TokensWithoutGold.map(token => (
                <span key={token} className={`my-card-info token-${token}`}>{cardBonusMap.get(token) ?? 0}</span>
              )) }
            </div>
            <div className="my-token-area">
              { AllTokens.map(token => (
                <span key={token} className={`my-token-info token-${token}`}>{(player?.tokens as any)[token] ?? 0}</span>
              )) }
            </div>
          </div>
          <div className="my-info-right">
            <div className="my-reserved-area">
              { player?.reservedCards.map(card => (
                <div className="my-reserved-card" key={card.id}>
                  <span className="card-content"> {card.name}</span>
                </div>
              )) }
              { Array.from({ length: emptySlotCount }, (_, i) => (
                <div key={`my-reserved-empty-${i}`} className="my-empty-reserved-card"></div>
              )) }
            </div>
          </div>
        </div>
      </article>

      {/* Turn Info */}
      <article className="right-inventory-area">
        <div className="turn-time">
          남은 시간: 30
        </div>
      </article>
    </section>
  )
}