import { Client, type Room } from "colyseus.js"
import { useEffect, useState } from "react"
import type {DevelopmentCard} from "@shared/models/colyseus/DevelopmentCard";

export default function Game() {
    const [connected, setConnected] = useState(false)
    const [room, setRoom] = useState<Room | null>(null)
    const [roomName, setRoomName] = useState<string>("")
    const [cards, setCards] = useState<DevelopmentCard[]>([])
    const [currentCardIndex, setCurrentCardIndex] = useState<number>(0)
    const [showModal, setShowModal] = useState(false)

    // 방 입장
    useEffect(() => {
        if (!roomName) return

        const client = new Client("ws://localhost:2567")
        client.joinOrCreate(roomName).then((joinedRoom) => {
            setRoom(joinedRoom)
            setConnected(true)

            joinedRoom.onLeave(() => setConnected(false))

            // 서버에서 cards 정보 수신
            joinedRoom.onMessage("start_game", (serverCards) => {
                setCards(serverCards)
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
        setCurrentCardIndex((i) => (i + 1 < cards.length ? i + 1 : 0))
    }

    return (
        <div>
            <p>연결 상태: {connected ? "✅ 연결됨" : "❌ 연결 안됨"}</p>

            {!connected && (
                <button onClick={() => setRoomName("nyangplendor")}>방 입장</button>
            )}

            {connected && (
                <>
                    <button onClick={startGame}>게임 시작</button>
                    {cards.length > 0 && <button onClick={openNextCard}>카드 열기</button>}
                </>
            )}

            {/* 카드 모달 */}
            {showModal && cards.length > 0 && (
                <div style={{ border: "1px solid black", padding: "1rem" }}>
                    <h2>카드 정보</h2>
                    <p>이름: {cards[currentCardIndex].name}</p>
                    <p>레벨: {cards[currentCardIndex].level}</p>
                    <p>Prestige: {cards[currentCardIndex].prestigePoint}</p>
                    <p>보너스: {cards[currentCardIndex].token}</p>
                    <button onClick={closeModal}>닫기</button>
                </div>
            )}
        </div>
    )
}
