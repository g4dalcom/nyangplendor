import type {DevelopmentCard} from "@shared/models/colyseus/DevelopmentCard";

import "./DevelopmentCardView.css";
import {TurnAction} from "@shared/types/enums/Action";
import type {TurnActionType} from "@/hooks";

interface Props {
  cardInfo: DevelopmentCard;
  turnActionInfo: TurnActionType
}

export const DevelopmentCardView = ({ cardInfo, turnActionInfo }: Props) => {
  //
  if (!cardInfo) return;

  const turnAction = turnActionInfo.action;
  const isPending = cardInfo.id === turnActionInfo?.card?.id && [TurnAction.PURCHASE_DEVELOPMENT_CARD, TurnAction.RESERVE_DEVELOPMENT_CARD].includes(turnAction);
  const ribbonText = turnAction === TurnAction.PURCHASE_DEVELOPMENT_CARD ? "PURCHASED" : "RESERVED";

  return (
    <div className={`card-container ${isPending ? "pending" : ""}`}>
      <div className={`card-header header-color-${cardInfo.level}`}>
        <div className="card-point">{cardInfo.prestigePoint > 0 ? cardInfo.prestigePoint : ''}</div>
        <div className="bonus-token">
          <span className={`token token-${cardInfo.token}`}></span>
        </div>
      </div>

      <div className="card-center">
        <img src={cardInfo.imageUrl} alt={cardInfo.name} className="card-image" />
      </div>

      <footer className="card-footer">
        <div className="token-list">
          { Object.entries(cardInfo.cost).flatMap(([token, count], i) =>
            <span key={`token-${i}`} className={`token token-${token}`}>{count}</span>
          ) }
        </div>
      </footer>

      { isPending &&
        <div className={`diagonal-ribbon ${turnAction}`}>
          { ribbonText }
        </div>
      }
    </div>
  );
}