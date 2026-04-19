import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDialog, useGameRoom, usePlayer} from "@/contexts";
import {Button} from "@/ui";

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
    <section className="flex flex-col center h-screen">
      <div className="card-container">
        <Button color="orange" onClick={handleCreate}>
          방 생성
        </Button>
        <div className="flex gap-[var(--spacing-sm)]">
          <input
            type="text"
            className="flex-1"
            maxLength={6}
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            placeholder="방 번호 (6자리)"
          />
          <Button color="green" onClick={handleJoin}>
            입장
          </Button>
        </div>
      </div>
    </section>
  );
  }