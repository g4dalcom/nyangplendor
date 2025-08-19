import { Client, type Room } from "colyseus.js"
import { useEffect, useState } from "react"
import type {GameState} from "@shared/states/GameState";
import type {DevelopmentCard} from "@shared/models/colyseus/DevelopmentCard";

export default function Game() {
  const [connected, setConnected] = useState(false)
  const [room, setRoom] = useState<Room | null>(null)
  const [roomName, setRoomName] = useState<string>("")
  const [, setGameState] = useState<GameState | null>(null)
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0)
  const [showModal, setShowModal] = useState(false)
  const [level1Cards, setLevel1Cards] = useState<DevelopmentCard[]>([])

  // 방 입장
  useEffect(() => {
    if (!roomName) return

    const client = new Client("ws://localhost:2567")
    client.joinOrCreate(roomName).then((joinedRoom) => {
      setRoom(joinedRoom)
      setConnected(true)

      joinedRoom.onLeave(() => setConnected(false))

      // 서버에서 cards 정보 수신
      joinedRoom.onMessage("start_game", (gameState: GameState) => {
        setGameState(gameState)
        setLevel1Cards(gameState.level1Cards)
      })
    })

    return () => {
      room?.leave()
    }
  }, [roomName])

  const startGame = () => {
    room?.send("start_game") // 서버에 게임 시작 요청
  }

  const openNextCard = () => {
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setCurrentCardIndex((i) => (i + 1 < level1Cards.length ? i + 1 : 0))
  }

  return (
    <div>
      <p>연결 상태: {connected ? "connected" : "disconnected"}</p>

      {!connected && <button onClick={() => setRoomName("nyangplendor")}>방 입장</button>}

      {connected && (
        <>
          <button onClick={startGame}>게임 시작</button>
          {level1Cards.length > 0 && <button onClick={openNextCard}>카드 열기</button>}
        </>
      )}

      {/* 카드 모달 */}
      {showModal && level1Cards.length > 0 && (
        <div style={{ border: "1px solid black", padding: "1rem" }}>
          <h2>카드 정보</h2>
          <p>이름: {level1Cards[currentCardIndex].name}</p>
          <p>레벨: {level1Cards[currentCardIndex].level}</p>
          <p>Prestige: {level1Cards[currentCardIndex].prestigePoint}</p>
          <p>보너스: {level1Cards[currentCardIndex].token}</p>
          <button onClick={closeModal}>닫기</button>
        </div>
      )}
    </div>
  )
}
