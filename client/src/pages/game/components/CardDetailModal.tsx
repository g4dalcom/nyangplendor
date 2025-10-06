import type {DevelopmentCard} from "@shared/models/colyseus/DevelopmentCard";
import {Modal} from "@/ui/modal/modal.tsx";
import {tokenImages} from "@/pages";
import {motion, useMotionValue, useTransform} from "framer-motion";
import {useRef} from "react";
import {Button} from "@/ui";
import {clsx} from "clsx";
import {cardLevelColorClasses, tokenColorClasses} from "@/styles/style.ts";
import type {Token} from "@shared/types/enums/GameObject";

interface Props {
  selectedCard: DevelopmentCard;
  closeModal: () => void;
  handleClickPurchase: () => void;
  handleClickReserve: () => void;
}

export const CardDetailModal = ({ selectedCard, closeModal, handleClickPurchase, handleClickReserve }: Props) => {
  //
  const isDragging = useRef<boolean>(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-150, 150], [30, -30]);
  const rotateY = useTransform(x, [-150, 150], [-30, 30]);

  const handleClose = () => {
    if (!isDragging.current) {
      closeModal();
    }
  };

  return (
    <Modal isOpen={!!selectedCard} onClose={handleClose} size="card" variant="card">
      <div className="flex h-full w-full flex-col justify-between gap-2 [perspective:300px]">
        <motion.section
          className="relative flex w-full flex-grow flex-col overflow-hidden rounded-lg border-2 border-stone-700 bg-[#f5eeda] shadow-lg [transform-style:preserve-3d]"
          style={{ x, y, rotateX, rotateY, transformStyle: "preserve-3d" }}
          drag
          dragElastic={0.5}
          dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
          onDragStart={() => isDragging.current = true}
          onDragEnd={() => isDragging.current = false}
        >
          <div className={clsx('relative z-10 flex items-center justify-between p-1', cardLevelColorClasses[selectedCard.level])}>
            <div className="ml-2 text-3xl font-bold text-white">{selectedCard.prestigePoint > 0 ? selectedCard.prestigePoint : ''}</div>
            <div className="bonus-token">
              <span className={clsx("flex h-9 w-9 items-center justify-center rounded-full border-2", tokenColorClasses[selectedCard.token])}>
                <img className="pointer-events-none relative z-10 h-[120%] w-[120%] rounded-full object-cover" src={tokenImages[selectedCard.token]} alt={`${selectedCard.token} 토큰`} />
              </span>
            </div>
          </div>

          <div className="absolute inset-0">
            <img className="pointer-events-none h-full w-full object-cover" src={selectedCard.imageUrl} alt={selectedCard.name} />
          </div>

          <footer className="relative z-10 mt-auto flex w-full items-center justify-center bg-white/40 p-2">
            <div className="flex gap-1">
              { Object.entries(selectedCard.cost).flatMap(([token, count], i) =>
                <span
                  key={`token-${i}`}
                  className={clsx(
                    "flex h-9 w-9 items-center justify-center rounded-full border-2 text-lg font-bold text-black",
                    tokenColorClasses[token as Token]
                  )}
                >
                  {count}
                </span>
              )}
            </div>
          </footer>
        </motion.section>

        <article className="relative flex w-full justify-center gap-2">
          <Button color="orange" onClick={handleClickReserve}>Reserve</Button>
          <Button color="green" onClick={handleClickPurchase}>Purchase</Button>
        </article>
      </div>
    </Modal>
  );
}