import {Token} from "@shared/types/enums/GameObject";
import type {Player} from "@shared/models/colyseus/Player";
import {useEffect, useState} from "react";

import "./PlayerInfo.css";
import emptyPlayer from "@/assets/images/empty-player.png";
import {AllTokens, TokensWithoutGold} from "@shared/utils/tokens";

interface Props {
  player: Player;
}

export const PlayerInfo = ({ player }: Props) => {
  //
  const [cardBonusMap, setCardBonusMap] = useState<Map<Token, number>>(new Map());

  useEffect(() => {
    if (player) {
      setCardBonusMap(calculateCardBonus(player));
    }
  }, [player]);

  const calculateCardBonus = (player: Player) => {
    const map = new Map<Token, number>();
    player?.developmentCards?.forEach(card => {
      const bonus = card.token;
      map.set(bonus, (map.get(bonus) ?? 0) + 1);
    })
    return map;
  }

  const renderReservedCards = (player: Player) => {
    const reservedCards = player.reservedCards;
    const emptySlotsCount = 3 - reservedCards.length;
    const emptySlots = Array.from({ length: emptySlotsCount }, (_, i) => (
      <div key={`player-reserved-empty-${i}`} className="player-empty-reserved-card"></div>
    ));

    return (
      <>
        { reservedCards.map(card => (
          <div className="player-reserved-card" key={card.id}>
            <span className="card-content">{card.name}</span>
          </div>
        )) }
        {emptySlots}
      </>
    )
  }

  return (
    <div className="player-info">
      { player ? (
        <>
          <div className="player-name">{player.name}</div>
          <div className="player-object-container">
            <div className="player-card-area">
              { TokensWithoutGold.map(token => (
                <span key={token} className={`player-card-info token-${token}`}>{cardBonusMap.get(token) ?? 0}</span>
              )) }
            </div>

            <div className="player-token-area">
              { AllTokens.map(token => (
                <span key={token} className={`player-token-info token-${token}`}>{(player.tokens as any)[token] ?? 0}</span>
              )) }
            </div>

            <div className="player-reserved-area">
              { renderReservedCards(player) }
            </div>
          </div>
        </>
      ) : (
        <div className="player-empty-slot">
          <img src={emptyPlayer} alt={"empty player"} className="empty-player-image" />
        </div>
      )}
    </div>
  );
}