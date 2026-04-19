import type {DevelopmentCard} from "@shared/models/colyseus/DevelopmentCard";
import {Modal} from "@/ui/modal/modal.tsx";
import {tokenImages} from "@/pages";
import {motion, useMotionValue, useTransform} from "framer-motion";
import {useMemo, useRef} from "react";
import {Button} from "@/ui";
import {clsx} from "clsx";
import {cardLevelColorClasses, tokenColorClasses} from "@/styles/style.ts";
import type {Token} from "@shared/types/enums/GameObject";
import type {TurnActionType} from "@/hooks";
import {TurnAction} from "@shared/types/enums/Action";
import {useGameRoom} from "@/contexts/GameRoomContext.tsx";
import {convertMapSchemaToRecord, getCardBonus, getPurchaseShortage} from "@shared/utils";
import {toast} from "react-toastify";

interface Props {
  selectedCard: DevelopmentCard;
  turnActionInfo: TurnActionType;
  closeModal: () => void;
  handleClickPurchase: () => void;
  handleClickReserve: () => void;
  handleClickCancel: () => void;
}

export const DevelopmentCardDetailModal = (props: Props) => {
  //
  const { selectedCard, turnActionInfo, closeModal, handleClickPurchase, handleClickReserve, handleClickCancel } = props;
  const { player } = useGameRoom();

  const isDragging = useRef<boolean>(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-150, 150], [30, -30]);
  const rotateY = useTransform(x, [-150, 150], [-30, 30]);

  const turnAction = turnActionInfo.action;
  const pendingReservedCard = turnAction === TurnAction.RESERVE_DEVELOPMENT_CARD && turnActionInfo.card?.id === selectedCard.id;
  const pendingPurchasedCard = turnAction === TurnAction.PURCHASE_DEVELOPMENT_CARD && turnActionInfo.card?.id === selectedCard.id;

  const affordability = useMemo(() => {
    if (!player || !selectedCard) return { isAffordable: true };
    const playerTokens = convertMapSchemaToRecord(player.tokens);
    const playerCardBonuses = getCardBonus(player.developmentCards);
    return getPurchaseShortage(selectedCard.cost, playerTokens, playerCardBonuses);
  }, [player, selectedCard]);

  const handleClose = () => {
    if (!isDragging.current) {
      closeModal();
    }
  };

  /* 구매 버튼 클릭 시 부족한 토큰 확인 후 토스트 출력 또는 구매 수행 */
  const onPurchaseClick = () => {
    if (!affordability.isAffordable) {
      toast("토큰이 부족합니다.", {
        containerId: "toast-message",
        className: "toast-body-center", // 중앙 정렬 클래스 적용
      });
      return;
    }
    handleClickPurchase();
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
          { pendingReservedCard ?
            <Button color="red" onClick={handleClickCancel}>Cancel</Button> :
            <Button color="orange" onClick={handleClickReserve}>Reserve</Button>
          }
          { pendingPurchasedCard ?
            <Button color="red" onClick={handleClickCancel}>Cancel</Button> :
            <Button color="green" onClick={onPurchaseClick}>Purchase</Button>
          }
        </article>
      </div>
    </Modal>
  );
}