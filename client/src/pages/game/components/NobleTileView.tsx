import "./NobleTileView.css";
import type {NobleTile} from "@shared/models/colyseus/NobleTile";

interface Props {
  nobleTile: NobleTile;
}

export const NobleTileView = ({ nobleTile }: Props) => {
  //
  if (!nobleTile) return;

  return (
    <div className="noble-tile-container">
      <div className="noble-tile-header">
        <div className="noble-tile-point">{nobleTile.point}</div>
      </div>

      <div className="noble-tile-center">
        <img src={nobleTile.imageUrl} alt={nobleTile.name} className="noble-tile-image" />
      </div>

      <footer className="noble-tile-footer">
        <div className="token-list">
          { Object.entries(nobleTile.cost).flatMap(([token, count], i) =>
            <span key={`token-${i}`} className={`token token-${token}`}>{count}</span>
          ) }
        </div>
      </footer>
    </div>
  );
}