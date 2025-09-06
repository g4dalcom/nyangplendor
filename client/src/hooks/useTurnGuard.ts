import { useCallback } from "react";

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
