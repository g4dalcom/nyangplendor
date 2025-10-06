import {Token} from "@shared/types/enums/GameObject";

export const tokenColorClasses: Record<Token, string> = {
  [Token.DIAMOND]: 'bg-[var(--color-token-diamond-bg)] border-[var(--color-token-diamond-border)]',
  [Token.SAPPHIRE]: 'bg-[var(--color-token-sapphire-bg)] border-[var(--color-token-sapphire-border)]',
  [Token.EMERALD]: 'bg-[var(--color-token-emerald-bg)] border-[var(--color-token-emerald-border)]',
  [Token.RUBY]: 'bg-[var(--color-token-ruby-bg)] border-[var(--color-token-ruby-border)]',
  [Token.ONYX]: 'bg-[var(--color-token-onyx-bg)] border-[var(--color-token-onyx-border)]',
  [Token.GOLD]: 'bg-[var(--color-token-gold-bg)] border-[var(--color-token-gold-border)]',
};

export const cardLevelColorClasses: Record<number, string> = {
  1: 'bg-[rgba(44,93,61,0.8)]',
  2: 'bg-[rgba(131,63,147,0.8)]',
  3: 'bg-[rgba(56,86,161,0.8)]',
}