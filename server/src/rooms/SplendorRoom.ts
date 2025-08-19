import { Room, Client } from "colyseus"
import {GameState} from "@shared/states/GameState";

export class SplendorRoom extends Room {
  onCreate(options: any) {
    console.log("SplendorRoom")

    this.onMessage("start_game", (client, message) => {
      console.log(`requested start_game from ${client.sessionId}`)
      let gameState = new GameState(client.sessionId);
      client.send("start_game", gameState)
    })
  }

  onJoin(client: Client, options: any) {
    console.log(`join: ${client.sessionId}`)
  }

  onLeave(client: Client, consented: boolean) {
    console.log(`leave room: ${client.sessionId}`)
  }

  onDispose() {
    console.log("remove room")
  }
}
