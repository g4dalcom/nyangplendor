import express from "express"
import cors from "cors"
import {matchMaker, Server} from "colyseus"
import {monitor} from "@colyseus/monitor"
import config from "@colyseus/tools"
import {GameRoom} from "@/rooms";

export default config({
  options: {},

  initializeExpress: (app) => {
    app.use(express.json());
    app.use(
      cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
      })
    );

    /**
     * colyseus API
     * 'name' 타입의 모든 활성화된 방을 조회
     * 서버에서 정의: gameServer.define("game", GameRoom)
     * 클라이언트에서 사용: client.create<GameState>("game", { playerId: player.id, nickname: player.nickname, roomCode: code })
     */
    app.get("/find-game-rooms", async (req, res) => {
      const rooms = await matchMaker.query({ name: "game" });
      res.send(rooms)
    });

    app.use("/colyseus-monitor", monitor());
  },

  initializeGameServer: (gameServer: Server) => {
    gameServer.define("game", GameRoom).enableRealtimeListing();
  },
});

