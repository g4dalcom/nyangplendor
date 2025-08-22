import { Room, Client } from "colyseus"
import {GameMetaDataType, Transfer} from "@shared/types";
import {GameState} from "@shared/states/GameState";

export class GameRoom extends Room<GameState> {

  /* 방 만들면 메타데이터 입력하면서 GameState 초기화 */
  onCreate = async (options: any) => {
    console.log("onCreate ::: options ::: ", options)

    await this.setMetadata(<GameMetaDataType>{
      playerId: options?.playerId,
      nickname: options?.nickname,
      roomCode: options?.roomCode,
    })

    this.state = new GameState(this.roomId);
  }

  /* 방 입장시 GameState에 플레이어 추가 */
  onJoin(client: Client, options: any) {
    console.log(`join: ${client.sessionId}`)

    this.onMessage(Transfer.ADD_PLAYER, (client, message) => {
      console.log("===== Add Player ===== ", message)
      this.state.addPlayer(message.id, message.nickname)
      client.send(Transfer.ADD_PLAYER, this.state.players)
    })
  }

  onLeave(client: Client, consented: boolean) {
    console.log(`leave room: ${client.sessionId}`)
  }

  onDispose() {
    console.log("remove room")
  }
}
