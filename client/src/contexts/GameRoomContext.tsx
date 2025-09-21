import {createContext, type ReactNode, useContext, useMemo, useState} from "react";
import {Client, type Room} from "colyseus.js";
import {type PlayerInfo, Transfer} from "@shared/types";
import type {GameState} from "@shared/states/GameState";
import type {Player} from "@shared/models/colyseus/Player";
import {useDialog} from "@/contexts/DialogContext.tsx";
import {toast} from "react-toastify";

type GameRoomContextType = {
  gameRoom?: Room<GameState>;
  gameState?: ReturnType<GameState['toJSON']>;
  player?: Player | null;
  createRoom: (player: PlayerInfo) => Promise<{ room: Room<GameState>; code: string }>;
  joinRoom: (code: string, player: PlayerInfo) => Promise<Room<GameState>>;
}

const GameRoomContext = createContext<GameRoomContextType>({} as GameRoomContextType);

export const GameRoomProvider = ({ children }: { children: ReactNode }) => {
  const client = new Client("ws://localhost:2567");
  const { alert } = useDialog();
  const [gameRoom, setGameRoom] = useState<Room<GameState>>();
  const [gameState, setGameState] = useState<ReturnType<GameState['toJSON']>>();

  /* 랜덤 6자리 방 입장 코드 */
  const generateCode = (length = 6) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from({ length }).map(() => chars[Math.floor(Math.random() * chars.length)]).join("");
  };

  const bindRoom = (room: Room<GameState>) => {
    setGameRoom(room);

    room.onStateChange((state) => {
      setGameState(state.toJSON());
    })
    room.onMessage(Transfer.START_GAME, (payload: any) => {
      alert(payload.message);
    });
    room.onMessage(Transfer.PLAYER_TURN, (payload: any) => {
      toast(payload.message, {
        containerId: "toast-message",
        className: "toast-body-center",
      })
    })

    room.onLeave(() => {
      setGameRoom(undefined);
      setGameState(undefined);
    });
  };

  /* 방 만들면서 입장 코드 만들기 */
  const createRoom = async (player: PlayerInfo) => {
    const code = generateCode();
    const room = await client.joinOrCreate<GameState>("game", { ...player, roomCode: code });
    bindRoom(room);
    return { room, code };
  };

  /* 입력 코드로 방 검색해서 아이디로 입장 */
  const joinRoom = async (code: string, player: PlayerInfo) => {
    const rooms = await fetch("http://localhost:2567/find-game-rooms").then(res => res.json());
    const found = rooms.find((r: any) => r.metadata?.roomCode === code);
    if (!found) throw new Error("방을 찾을 수 없습니다.");
    const room = await client.joinById<GameState>(found.roomId, { ...player });
    bindRoom(room);
    return room;
  };

  const player = useMemo(() => {
    if (!gameRoom || !gameState) return null;
    return gameState.players.find((p) => p.sessionId === gameRoom.sessionId) ?? null;
  }, [gameState, gameRoom]);

  return (
    <GameRoomContext.Provider value={{ gameRoom, gameState, player, createRoom, joinRoom }}>
      {children}
    </GameRoomContext.Provider>
  );
};

export const useGameRoom = () => useContext(GameRoomContext);
