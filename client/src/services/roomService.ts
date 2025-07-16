import { Client } from "colyseus.js";

const client = new Client("ws://localhost:2567");

async function joinRoom() {
  try {
    const room = await client.joinOrCreate("nyangplendor");
    console.log("✅ 방 입장 성공:", room.sessionId);

    // 서버에서 보내는 메시지 수신 대기
    room.onMessage("game_state", (state) => {
      console.log("서버에서 받은 상태:", state);
    });

    // 연결 종료 이벤트
    room.onLeave(() => {
      console.log("⚠️ 방에서 나감");
    });

  } catch (e) {
    console.error("❌ 방 입장 실패:", e);
  }
}

joinRoom();
