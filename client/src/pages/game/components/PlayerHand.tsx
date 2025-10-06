import {Token} from "@shared/types/enums/GameObject";
import {tokenImages} from "@/pages";
import type {Player} from "@shared/models/colyseus/Player";
import {type MouseEvent, useEffect, useState} from "react";
import {AllTokens, initializeTokens, TokensWithoutGold} from "@shared/utils/tokens";
import {clsx} from "clsx";
import {tokenColorClasses} from "@/styles/style.ts";
import {GamePhase} from "@shared/types/enums/States";
import {Button} from "@/ui";

interface Props {
  player: Player | null | undefined;
  pendingTokens: Record<Token, number>;
  undoBringToken: (event: MouseEvent<HTMLButtonElement>) => void;
  gamePhase: GamePhase | undefined;
  disableStartButton: boolean;
  disableTurnEndButton: boolean;
  handleStartGame: () => void;
  handleEndTurn: () => void;
}

export const PlayerHand = (props: Props) => {
  const { player, pendingTokens, undoBringToken, gamePhase, disableStartButton, disableTurnEndButton, handleStartGame, handleEndTurn } = props;

  const [cardBonusMap, setCardBonusMap] = useState<Record<Token, number>>(initializeTokens());
  const emptySlotCount = 3 - (player?.reservedCards.length ?? 0);

  useEffect(() => {
    if (player) {
      calculateCardBonus(player)
    }
  }, [player?.developmentCards]);

  const calculateCardBonus = (player: Player) => {
    const map = initializeTokens();
    for (const card of player.developmentCards) {
      const bonus = card.token;
      map[bonus] += 1;
    }
    setCardBonusMap(map)
  }

  const calculatePlayerTokenCount = () => {
    if (!player) return 0;
    return Object.entries(player?.tokens).reduce((acc, [, count]) => acc + count, 0) ?? 0;
  }

  return (
    <>
      {/* Bring Token Area */}
      <article className="center gap padding border-4 border-double border-coffee rounded-lg w-40 h-16 lg:w-60 lg:h-20">
        { Object.entries(pendingTokens).map(([token, count]) =>
          [...Array(count)].map((_, i) => (
            <button
              key={`${token}-${i}`}
              value={token}
              className={clsx("token-size rounded-full border-2 w-8 h-8 lg:w-12 lg:h-12", tokenColorClasses[token as Token])}
              onClick={undoBringToken}
            >
              <img src={tokenImages[token as Token]} alt={token} className="w-full h-full rounded-full object-cover" />
            </button>
          ))
        ) }
      </article>

      {/* My Object PlayerHand */}
      <article className="relative container center justify-evenly gap padding">
        {/* Score */}
        <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-coffee border-2 border-white z-10 score-shadow">
          <span className="center h-full w-full text-white text-sm font-bold">{player?.score ?? 0}</span>
        </div>

        {/* My Info */}
        <span className="font-bold text-lg lg:text-xl padding">{calculatePlayerTokenCount()} / 10</span>
        <div className="flex flex-col gap-2 items-center">
          <div className="flex gap-3 items-center">
            { TokensWithoutGold.map(token => (
              <span key={token} className={clsx("center w-7 h-9 lg:w-8 lg:h-10 rounded-[20%] border-2", tokenColorClasses[token])}>{cardBonusMap[token]}</span>
            )) }
          </div>
          <div className="flex gap-3 items-center">
            { AllTokens.map(token => (
              <span key={token} className={clsx("w-5 h-5 lg:w-6 lg:h-6 rounded-full border-2 flex justify-center items-center", tokenColorClasses[token])}>{(player?.tokens as any)[token] ?? 0}</span>
            )) }
          </div>
        </div>

        {/* Reserved Cards */}
        <div className="flex">
          <div className="flex gap-2">
            { player?.reservedCards.map(card => (
              <div className="w-12 h-16 bg-secondary rounded-lg flex justify-center items-center font-bold shadow-sm shrink-0" key={card.id}>
                <span className="text-xs">{card.name}</span>
              </div>
            )) }
            { Array.from({ length: emptySlotCount }, (_, i) => (
              <div key={`my-reserved-empty-${i}`} className="w-12 h-16 bg-primary rounded-lg border border-dashed border-[#999] shrink-0"></div>
            )) }
          </div>
        </div>

        <div className="flex">
          { gamePhase === GamePhase.WAITING_FOR_PLAYERS ?
            <Button color="green" size="sm" onClick={handleStartGame} disabled={disableStartButton}>
              게임 시작
            </Button>
            :
            <Button color="blue" size="sm" onClick={handleEndTurn} disabled={disableTurnEndButton}>
              턴 종료
            </Button>
          }
        </div>
      </article>
    </>
  )
}