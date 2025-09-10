import {MapSchema} from "@colyseus/schema";

export type TokenCountMap = MapSchema<number>;

export type GameMetaDataType = {
  playerId: string;
  nickname: string;
  roomCode: string;
}

export type PlayerInfo = {
  id: string;
  nickname: string;
}