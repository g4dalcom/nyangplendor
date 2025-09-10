import {TurnAction} from "@shared/types/enums/Action";
import {getTotalTokens, initializeTokens} from "@shared/utils/tokens";
import {Token} from "@shared/types/enums/GameObject";
import type {DevelopmentCard} from "@shared/models/colyseus/DevelopmentCard";
import {useState} from "react";

type TurnActionType = {
  action: TurnAction;
  tokens: Record<Token, number>;
  card?: DevelopmentCard;
}

export const useTurnAction = () => {
  const [turnActionInfo, setTurnActionInfo] = useState<TurnActionType>({ action: TurnAction.NO_ACTION, tokens: initializeTokens() });

  const resetActionInfo = () => {
    setTurnActionInfo(turnActionFactory.initialize());
  };

  const updateWithTokens = (tokens: Record<Token, number>) => {
    setTurnActionInfo(turnActionFactory.createWithTokens(tokens));
  };

  const updateWithCard = (turnAction: TurnAction, card: DevelopmentCard) => {
    setTurnActionInfo(turnActionFactory.createWithCard(turnAction, card));
  };

  return {
    turnActionInfo,
    resetActionInfo,
    updateWithTokens,
    updateWithCard,
  };
};

export const turnActionFactory = {
  initialize: (): TurnActionType => {
    return {
      action: TurnAction.NO_ACTION,
      tokens: initializeTokens(),
      card: undefined,
    }
  },
  createWithTokens: (tokens: Record<Token, number>): TurnActionType => {
    return {
      action: getTotalTokens(tokens) > 0 ? TurnAction.BRING_TOKEN : TurnAction.NO_ACTION,
      tokens: tokens,
      card: undefined,
    }
  },
  createWithCard: (turnAction: TurnAction, card: DevelopmentCard): TurnActionType => {
    return {
      action: turnAction,
      tokens: initializeTokens(),
      card: card,
    }
  },
}