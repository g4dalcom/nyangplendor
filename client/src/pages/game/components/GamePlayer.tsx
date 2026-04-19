import {Token} from "@shared/types/enums/GameObject";
import type {Player} from "@shared/models/colyseus/Player";
import {type Dispatch, type SetStateAction, useEffect, useState} from "react";
import emptyPlayer from "@/assets/images/empty-player.png";
import {AllTokens, initializeTokens, TokensWithoutGold} from "@shared/utils/tokens";
import {clsx} from "clsx";
import {cardLevelColorClasses, tokenColorClasses} from "@/styles/style.ts";
import type {DevelopmentCard} from "@shared/models/colyseus/DevelopmentCard";

interface Props {
  player: Player;
  setSelectedCard: Dispatch<SetStateAction<DevelopmentCard | null>>;
}

export const GamePlayer = ({ player, setSelectedCard }: Props) => {
  //
  const [cardBonusMap, setCardBonusMap] = useState<Record<Token, number>>(initializeTokens());

  useEffect(() => {
    if (player) {
      setCardBonusMap(calculateCardBonus(player));
    }
  }, [player]);

  const calculateCardBonus = (player: Player) => {
    const map = initializeTokens();
    player?.developmentCards?.forEach(card => {
      const bonus = card.token;
      map[bonus] += 1;
    })
    return map;
  }

  const renderReservedCards = (player: Player) => {
    const reservedCards = player.reservedCards;
    const emptySlotsCount = 3 - reservedCards.length;
    const emptySlots = Array.from({ length: emptySlotsCount }, (_, i) => (
      <div key={`player-reserved-empty-${i}`} className="w-8 h-10 border border-dashed border-ui-border shrink-0" style={{ borderRadius: 'var(--radius-sm)' }}></div>
    ));

    return (
      <>
        { reservedCards.map(card => (
          <div className="w-8 h-10 rounded-lg border center shrink-0 overflow-hidden hover:animate-scale" key={card.id} onClick={() => setSelectedCard(card)}>
            <div className={clsx('relative w-full h-full flex flex-col')}>
              <div className={clsx("p-1 relative z-10", cardLevelColorClasses[card.level])}></div>
              <div className="absolute inset-0">
                <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        )) }
        {emptySlots}
      </>
    )
  }

  return (
    <article className="relative container flex-col center w-40 h-42 lg:w-42 lg:h-54 text-center gap">
      {/* Score */}
      <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-coffee border-2 border-white z-10 score-shadow">
        <span className="center h-full w-full text-white text-sm font-bold">{player?.score ?? 0}</span>
      </div>

      { player ? (
        <>
          <div className="text-[0.9em] font-bold max-w-42 whitespace-nowrap overflow-hidden text-ellipsis">{player.name}</div>
          <div className="flex flex-col gap center">
            <div className="flex gap-1">
              { TokensWithoutGold.map(token => (
                <span key={token} className={clsx("center w-5 h-7 lg:w-6 lg:h-8 rounded-[20%] border-2", tokenColorClasses[token])}>{cardBonusMap[token]}</span>
              )) }
            </div>

            <div className="flex gap-1">
              { AllTokens.map(token => (
                <span key={token} className={clsx("center w-5 h-5 rounded-full border-2", tokenColorClasses[token])}>{(player.tokens as any)[token] ?? 0}</span>
              )) }
            </div>

            <div className="flex gap-2">
              { renderReservedCards(player) }
            </div>
          </div>
        </>
      ) : (
        <div className="center w-full h-full text-center italic text-coffee">
          <img src={emptyPlayer} alt={"empty player"} className="w-30 h-auto" />
        </div>
      )}
    </article>
  );
}