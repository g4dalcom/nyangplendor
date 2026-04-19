import {motion, useMotionValue, useTransform } from "framer-motion";
import {useRef} from "react";
import type {NobleTile} from "@shared/models/colyseus/NobleTile";
import {Modal} from "@/ui";
import {clsx} from "clsx";
import {tokenColorClasses} from "@/styles/style.ts";
import type {Token} from "@shared/types/enums/GameObject";

interface Props {
  selectedNobleTile: NobleTile;
  closeModal: () => void;
}

export const NobleTileDetailModal = ({ selectedNobleTile, closeModal }: Props) => {
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
    <Modal isOpen={!!selectedNobleTile} onClose={handleClose} size="tile" variant="tile">
      <div className="flex h-full w-full flex-col justify-between gap-2 [perspective:300px]">
        <motion.section
          className="relative flex w-full flex-grow flex-col overflow-hidden rounded-lg border-2 border-ui-border-dark bg-ui-bg shadow-lg [transform-style:preserve-3d]"
          style={{ x, y, rotateX, rotateY, transformStyle: "preserve-3d" }}
          drag
          dragElastic={0.5}
          dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
          onDragStart={() => isDragging.current = true}
          onDragEnd={() => isDragging.current = false}
        >
          <div className="relative z-[1] flex items-center justify-between p-1">
            <div className="ml-2 text-3xl font-bold text-white">{selectedNobleTile.point}</div>
          </div>

          <div className="absolute inset-0">
            <img className="pointer-events-none h-full w-full object-cover" src={selectedNobleTile.imageUrl} alt={selectedNobleTile.name} />
          </div>

          <footer className="relative z-[1] mt-auto flex w-full items-center justify-center bg-white/40 p-2">
            <div className="flex gap-1">
              { Object.entries(selectedNobleTile.cost).flatMap(([token, count], i) =>
                <span
                  key={`token-${i}`}
                  className={clsx(
                    'center h-9 w-9 rounded-full border-2 text-lg font-bold text-black',
                    tokenColorClasses[token as Token]
                  )}
                >
                  {count}
                </span>
              )}
            </div>
          </footer>
        </motion.section>
      </div>
    </Modal>
  );
}