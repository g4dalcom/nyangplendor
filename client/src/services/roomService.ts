import { Client } from "colyseus.js"

const client = new Client("ws://localhost:2567")

async function joinRoom() {
  try {
    const room = await client.joinOrCreate("nyangplendor")
    console.log("success join room:", room.sessionId)

    // 서버에서 보내는 메시지 수신 대기
    room.onMessage("game_state", (state) => {
      console.log("received state from server:", state)
    })

    // 연결 종료 이벤트
    room.onLeave(() => {
      console.log("leave the room")
    })
  } catch (e) {
    console.error("error:", e)
  }
}

joinRoom()
