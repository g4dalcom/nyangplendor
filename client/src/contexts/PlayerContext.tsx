import {createContext, type FC, type ReactNode, useContext, useEffect, useState} from "react";
import type {PlayerInfo} from "@shared/types";

type PlayerContextType = {
  player: PlayerInfo | null;
}

const PlayerContext = createContext<PlayerContextType>({
  player: null,
});

const adverbs = ["완전", "미친듯이", "그냥저냥", "갑자기", "대충", "심지어", "나름"];
const adjectives = ["빠른", "소심한", "조용한", "활기찬", "신난", "거친", "게으른", "못난", "못생긴", "우수한", "부드러운"];
const nouns = ["갱얼쥐", "냥냥이", "여우", "꿀벌", "사자", "벌꿀오소리"];

const generateRandomNickname = () => {
  const adv = adverbs[Math.floor(Math.random() * adverbs.length)];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adv}${adj}${noun}`;
};

export const PlayerProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [player, setPlayer] = useState<PlayerInfo | null>(null);

  /* 세션 스토리지에 id, nickname 입력해서 플레이어 구분 */
  useEffect(() => {
    let id = sessionStorage.getItem("playerId");
    let nickname = sessionStorage.getItem("nickname");

    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem("playerId", id);
    }

    if (!nickname) {
      nickname = prompt("Enter your nickname (or a random one will be given)") || generateRandomNickname();
      sessionStorage.setItem("nickname", nickname);
    }

    setPlayer({ id, nickname });
  }, []);

  return (
    <PlayerContext.Provider value={{ player }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
