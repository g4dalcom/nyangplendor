import { useCallback } from "react";

/* 내 턴에만 행동이 가능하도록 */
export const useTurnGuard = (isMyTurn: boolean) => {
  return useCallback(
    function guard<T extends (...args: any[]) => void>(fn: T, fallback?: T): T {
      return ((...args: any[]) => {
        if (!isMyTurn) {
          if (fallback) fallback(...args);
          return;
        }
        return fn(...args);
      }) as T;
    },
    [isMyTurn]
  );
}
