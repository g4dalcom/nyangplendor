import type {NobleTile} from "@shared/models/colyseus/NobleTile";
import {clsx} from "clsx";
import {tokenColorClasses} from "@/styles/style.ts";
import type {Token} from "@shared/types/enums/GameObject";

interface Props {
  nobleTile: NobleTile;
}

export const NobleTileView = ({ nobleTile }: Props) => {
  if (!nobleTile) return null;

  return (
    <div 
      className="relative w-full h-full bg-ui-bg border-2 border-ui-border-dark shadow-lg flex flex-col overflow-hidden transition-transform duration-150 hover:-translate-y-px hover:scale-105"
      style={{ borderRadius: 'var(--radius-sm)' }}
    >
      <div className="px-1 py-0.5 flex justify-between items-center relative z-10">
        <div className="text-white font-bold m-0">{nobleTile.point}</div>
      </div>

      <div className="absolute inset-0">
        <img src={nobleTile.imageUrl} alt={nobleTile.name} className="w-full h-full object-cover" />
      </div>

      <footer className="absolute bottom-0 left-0 w-full z-10 bg-white/40 p-1 center mt-auto">
        <div className="flex gap-1">
          { Object.entries(nobleTile.cost).flatMap(([token, count]) => (
            <span key={`${token}`} className={clsx("info-size rounded-full border-2 flex justify-center items-center text-xs font-bold", tokenColorClasses[token as Token])}>
              {count}
            </span>
          )) }
        </div>
      </footer>
    </div>
  );
}