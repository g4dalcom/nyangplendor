import "./NobleTileDetailModal.css";
import {motion, useMotionValue, useTransform } from "framer-motion";
import {useState} from "react";
import type {NobleTile} from "@shared/models/colyseus/NobleTile";
import {Modal} from "@/ui";

interface Props {
  selectedNobleTile: NobleTile;
  nobleTileDetailModalOpen: boolean;
  closeModal: () => void;
}

export const NobleTileDetailModal = ({ selectedNobleTile, nobleTileDetailModalOpen, closeModal }: Props) => {
  //
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-150, 150], [30, -30]);
  const rotateY = useTransform(x, [-150, 150], [-30, 30]);

  const handleClose = () => {
    if (!isDragging) {
      closeModal();
    }
  };

  return (
    <Modal isOpen={nobleTileDetailModalOpen} onClose={handleClose} size="tile" variant="tile">
      <div className="noble-tile-detail-wrapper">
        <motion.section
          className="noble-tile-detail-container"
          style={{ x, y, rotateX, rotateY, transformStyle: "preserve-3d" }}
          drag
          dragElastic={0.3}
          dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
        >
          <div className="noble-tile-detail-header">
            <div className="noble-tile-detail-point">{selectedNobleTile.point}</div>
          </div>

          <div className="noble-tile-detail-center">
            <img className="noble-tile-detail-image" src={selectedNobleTile.imageUrl} alt={selectedNobleTile.name} />
          </div>

          <footer className="noble-tile-detail-footer">
            <div className="token-list">
              { Object.entries(selectedNobleTile.cost).flatMap(([token, count], i) =>
                <span key={`token-${i}`} className={`noble-tile-detail-token token-${token}`}>{count}</span>
              )}
            </div>
          </footer>
        </motion.section>
      </div>
    </Modal>
  );
}