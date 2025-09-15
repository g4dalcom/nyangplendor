import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDialog, useGameRoom, usePlayer} from "@/contexts";
import "./Lobby.css";

export const Lobby = () => {
  //
  const navigate = useNavigate();
  const { player } = usePlayer();
  const { createRoom, joinRoom } = useGameRoom();
  const { alert } = useDialog();
  const [roomCode, setRoomCode] = useState<string>("");

  const handleJoin = async () => {
    if (!player) return;
    let room = await joinRoom(roomCode, player);
    console.log("join room:", room)
    navigate(`/game/${room?.roomId}`);
  };

  const handleCreate = async () => {
    if (!player) return;
    const { room, code } = await createRoom(player);
    await navigator.clipboard.writeText(code);
    alert(`방 코드: ${code}`);
    console.log("make room:", room)
    navigate(`/game/${room?.roomId}`);
  }

  return (
    <div className="lobby-container">
      <div className="lobby-card">
        <button className="bubbly orange" onClick={handleCreate}>
          방 생성
        </button>

        <div className="join-section">
          <input
            type="text"
            maxLength={6}
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            placeholder="방 번호 (6자리)"
            className="input-room"
          />
          <button className="bubbly green" onClick={handleJoin}>
            입장
          </button>
        </div>
      </div>
    </div>
  );
}