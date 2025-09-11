import "./CardDetailModal.css";
import type {DevelopmentCard} from "@shared/models/colyseus/DevelopmentCard";
import {Modal} from "@/ui/modal/modal.tsx";
import {tokenImages} from "@/pages";
import {motion, useMotionValue, useTransform} from "framer-motion";
import {useRef} from "react";

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
      <div className="card-detail-wrapper">
        <motion.section
          className="card-detail-container"
          style={{ x, y, rotateX, rotateY, transformStyle: "preserve-3d" }}
          drag
          dragElastic={0.5}
          dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
          onDragStart={() => isDragging.current = true}
          onDragEnd={() => isDragging.current = false}
        >
          <div className={`card-detail-header header-color-${selectedCard.level}`}>
            <div className="card-detail-point">{selectedCard.prestigePoint > 0 ? selectedCard.prestigePoint : ''}</div>
            <div className="bonus-token">
            <span className={`card-detail-token token-${selectedCard.token}`}>
              <img className="card-detail-token-image" src={tokenImages[selectedCard.token]} alt={`${selectedCard.token} 토큰`} />
            </span>
            </div>
          </div>

          <div className="card-detail-center">
            <img className="card-detail-image" src={selectedCard.imageUrl} alt={selectedCard.name} />
          </div>

          <footer className="card-detail-footer">
            <div className="token-list">
              { Object.entries(selectedCard.cost).flatMap(([token, count], i) =>
                <span key={`token-${i}`} className={`card-detail-token token-${token}`}>{count}</span>
              )}
            </div>
          </footer>
        </motion.section>

        <article className="card-actions-container">
          <button className="bubbly orange" onClick={handleClickReserve}>Reserve</button>
          <button className="bubbly green" onClick={handleClickPurchase}>Purchase</button>
        </article>
      </div>
    </Modal>
  );
}