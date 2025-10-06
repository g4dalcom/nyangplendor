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
    <section className="flex flex-col">
      <div className="flex items-center justify-center h-screen">
        <div className="p-5 bg-white rounded-xl flex flex-col gap-2.5 shadow-[inset_-6px_-6px_0px_0px_#cfcfcf,2px_2px_0px_#2d334b]">
          <Button color="orange" onClick={handleCreate}>
            방 생성
          </Button>
          <div className="flex gap-2.5">
            <input
              type="text"
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
      </div>
    </section>
  );
}