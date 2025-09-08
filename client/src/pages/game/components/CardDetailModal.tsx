import "./CardDetailModal.css";
import type {DevelopmentCard} from "@shared/models/colyseus/DevelopmentCard";
import {Modal} from "@/ui/modal/modal.tsx";
import {tokenImages} from "@/pages";

interface Props {
  selectedCard: DevelopmentCard;
  cardDetailModalOpen: boolean;
  closeModal: () => void;
}

export const CardDetailModal = ({ selectedCard, cardDetailModalOpen, closeModal }: Props) => {
  //
  return (
    <Modal isOpen={cardDetailModalOpen} onClose={closeModal} size="card" variant="card">
      <div className="card-detail-wrapper">
        <section className="card-detail-container">
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
        </section>

        <article className="card-actions-container">
          <button className="bubbly orange">Reserve</button>
          <button className="bubbly green">Purchase</button>
        </article>
      </div>
    </Modal>
  );
}