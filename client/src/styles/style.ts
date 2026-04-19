import {Token} from "@shared/types/enums/GameObject";

export const tokenColorClasses: Record<Token, string> = {
  [Token.DIAMOND]: 'bg-token-diamond-bg border-token-diamond-border',
  [Token.SAPPHIRE]: 'bg-token-sapphire-bg border-token-sapphire-border',
  [Token.EMERALD]: 'bg-token-emerald-bg border-token-emerald-border',
  [Token.RUBY]: 'bg-token-ruby-bg border-token-ruby-border',
  [Token.ONYX]: 'bg-token-onyx-bg border-token-onyx-border',
  [Token.GOLD]: 'bg-token-gold-bg border-token-gold-border',
};

export const cardLevelColorClasses: Record<number, string> = {
  1: 'bg-level-1-bg',
  2: 'bg-level-2-bg',
  3: 'bg-level-3-bg',
}