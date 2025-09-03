import {Token} from "@shared/types/enums/GameObject";
import type {Player} from "@shared/models/colyseus/Player";
import {useEffect, useState} from "react";

import "./PlayerInfo.css";
import emptyPlayer from "@/assets/images/empty-player.png";

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
      <div key={`reserved-empty-${i}`} className="empty-reserved-card"></div>
    ));

    return (
      <>
        {reservedCards.map(card => (
          <div className="reserved-card" key={card.id}>
            <span className="card-content"> {card.name}</span>
          </div>
        ))}
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
              {[Token.RUBY, Token.SAPPHIRE, Token.EMERALD, Token.DIAMOND, Token.ONYX].map(token => (
                <span key={token} className={`card-info token-${token}`}>{cardBonusMap.get(token) ?? 0}</span>
              ))}
            </div>

            <div className="player-token-area">
              {[Token.RUBY, Token.SAPPHIRE, Token.EMERALD, Token.DIAMOND, Token.ONYX, Token.GOLD].map(token => (
                <span key={token} className={`token-info token-${token}`}>{(player.tokens as any)[token] ?? 0}</span>
              ))}
            </div>

            <div className="player-reserved-area">
              {renderReservedCards(player)}
            </div>
          </div>
        </>
      ) : (
        <div className="empty-slot">
          <img src={emptyPlayer} alt={"empty player"} className="empty-player-image" />
        </div>
      )}
    </div>
  );
}