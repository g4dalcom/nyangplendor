import {createContext, type ReactNode, useContext, useState} from "react";
import {Client, type Room} from "colyseus.js";
import {type PlayerInfo, Transfer} from "@shared/types";
import type {GameState} from "@shared/states/GameState";

type GameRoomContextType = {
  gameRoom?: Room<GameState>;
  createRoom: (player: PlayerInfo) => Promise<{ room: Room<GameState>; code: string }>;
  joinRoom: (code: string, player: PlayerInfo) => Promise<Room<GameState>>;
  addPlayer: (player: PlayerInfo) => void;
}

const GameRoomContext = createContext<GameRoomContextType>({} as GameRoomContextType);

export const GameRoomProvider = ({ children }: { children: ReactNode }) => {
  const [gameRoom, setGameRoom] = useState<Room<GameState>>();
  const client = new Client("ws://localhost:2567");

  /* 랜덤 6자리 방 입장 코드 */
  const generateCode = (length = 6) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from({ length }).map(() => chars[Math.floor(Math.random() * chars.length)]).join("");
  };

  const bindRoom = (room: Room<GameState>) => {
    setGameRoom(room);

    room.onLeave(() => {
      setGameRoom(undefined);
    });
  };

  /* 방 만들면서 입장 코드 만들기 */
  const createRoom = async (player: PlayerInfo) => {
    const code = generateCode();
    const room = await client.create<GameState>("game", { playerId: player.id, nickname: player.nickname, roomCode: code });
    bindRoom(room);
    return { room, code };
  };

  /* 입력 코드로 방 검색해서 아이디로 입장 */
  const joinRoom = async (code: string, player: PlayerInfo) => {
    const rooms = await fetch("http://localhost:2567/find-game-rooms").then(res => res.json());
    const found = rooms.find((r: any) => r.metadata?.roomCode === code);
    if (!found) throw new Error("방을 찾을 수 없습니다.");
    const room = await client.joinById<GameState>(found.roomId, { playerId: player.id, nickname: player.nickname, roomCode: code });
    bindRoom(room);
    return room;
  };

  /* GameRoom 에 메시지 보내서 플레이어 추가 */
  const addPlayer = (player: PlayerInfo) => {
    if (gameRoom) {
      gameRoom.send(Transfer.ADD_PLAYER, player);
    }
  };

  return (
    <GameRoomContext.Provider value={{ gameRoom, createRoom, joinRoom, addPlayer }}>
      {children}
    </GameRoomContext.Provider>
  );
};

export const useGameRoom = () => useContext(GameRoomContext);
