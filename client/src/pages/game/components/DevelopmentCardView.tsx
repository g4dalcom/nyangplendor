import type {DevelopmentCard} from "@shared/models/colyseus/DevelopmentCard";
import {TurnAction} from "@shared/types/enums/Action";
import type {TurnActionType} from "@/hooks";
import {clsx} from "clsx";
import {cardLevelColorClasses, tokenColorClasses} from "@/styles/style";
import type {Token} from "@shared/types/enums/GameObject";

interface Props {
  cardInfo: DevelopmentCard;
  turnActionInfo: TurnActionType
}

export const DevelopmentCardView = ({ cardInfo, turnActionInfo }: Props) => {
  if (!cardInfo) return null;

  const turnAction = turnActionInfo.action;
  const isPending = cardInfo.id === turnActionInfo?.card?.id && [TurnAction.PURCHASE_DEVELOPMENT_CARD, TurnAction.RESERVE_DEVELOPMENT_CARD].includes(turnAction);
  const ribbonText = turnAction === TurnAction.PURCHASE_DEVELOPMENT_CARD ? "Purchased" : "Reserved";

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden transition-transform duration-150 hover:-translate-y-px hover:scale-105">
      <div className={clsx(
        'relative w-full h-full bg-[#f5eeda] border border-gray-300 shadow-lg flex flex-col',
        { 'grayscale-[80%] brightness-70': isPending }
      )}>
        <div className={clsx("px-1 py-0.5 flex justify-between items-center relative z-10", cardLevelColorClasses[cardInfo.level])}>
          <div className="w-2 h-2 lg:w-3 lg:h-3 flex items-center justify-center text-sm text-white font-bold m-0">{cardInfo.prestigePoint > 0 ? cardInfo.prestigePoint : ''}</div>
          <div className={clsx("info-size rounded-full border-2", tokenColorClasses[cardInfo.token])}>
          </div>
        </div>

        <div className="absolute inset-0">
          <img src={cardInfo.imageUrl} alt={cardInfo.name} className="w-full h-full object-cover" />
        </div>

        <footer className="absolute bottom-0 left-0 w-full z-10 bg-white/40 p-1 center mt-auto">
          <div className="flex gap-1">
            { Object.entries(cardInfo.cost).flatMap(([token, count]) => (
              <span key={`${token}`} className={clsx("info-size rounded-full border-2 center text-xs font-bold", tokenColorClasses[token as Token])}>
                {count}
              </span>
            )) }
          </div>
        </footer>
      </div>

      { isPending &&
        <div className={clsx(
          "absolute top-[65px] -left-[40px] w-[200px] py-1.5 text-center font-bold text-[0.9em] tracking-wider -rotate-35 origin-center shadow-md z-10",
          {
            'bg-[#4CAF50] text-white': turnAction === TurnAction.PURCHASE_DEVELOPMENT_CARD,
            'bg-[#FFC107] text-gray-800': turnAction === TurnAction.RESERVE_DEVELOPMENT_CARD
          }
        )}>
          { ribbonText }
        </div>
      }
    </div>
  );
}