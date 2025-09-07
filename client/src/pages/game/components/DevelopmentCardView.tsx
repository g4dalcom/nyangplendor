import type {DevelopmentCard} from "@shared/models/colyseus/DevelopmentCard";

import "./DevelopmentCardView.css";

interface Props {
  cardInfo: DevelopmentCard;
}

export const DevelopmentCardView = ({ cardInfo }: Props) => {
  //
  if (!cardInfo) return;

  return (
    <div className="card-container">
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
          )}
        </div>
      </footer>
    </div>
  );
}