import {Client, type Room} from "colyseus.js";
import {useEffect, useState} from "react"

export default function Game() {
  const [connected, setConnected] = useState(false);
  const [room, setRoom] = useState<Room | null>(null);
  const [roomName, setRoomName] = useState<string>("");

  useEffect(() => {
    const client = new Client("ws://localhost:2567");
    client.joinOrCreate(roomName)
        .then(room => {
          setRoom(room);
          setConnected(true);

          room.onLeave(() => setConnected(false));
        })
        .catch(() => setConnected(false));

    return () => {
      room?.leave();
    };
  }, [roomName]);

  return (
      <div>
        <p>연결 상태: {connected ? "✅ 연결됨" : "❌ 연결 안됨"}</p>
          <button onClick={() => setRoomName("nyangplendor")}>방 입장</button>
          <button onClick={() => {
              setRoomName("");
              room?.leave();
          }}>방 나가기</button>
      </div>
  );
}
