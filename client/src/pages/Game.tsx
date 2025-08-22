import {useEffect, useState} from "react"
import {Transfer} from "@shared/types";
import {useGameRoom, usePlayer} from "@/contexts";
import type {Player} from "@shared/models/colyseus/Player";

export const Game = () => {
  //
  const { player } = usePlayer();
  const { gameRoom } = useGameRoom();
  const [players, setPlayers] = useState<Player[]>([])

  useEffect(() => {
    if (!gameRoom || !player) return;

    gameRoom.send(Transfer.ADD_PLAYER, player);
    gameRoom.onMessage(Transfer.ADD_PLAYER, (players: Player[]) => {
      setPlayers(players)
    })

    return () => {
      gameRoom?.leave();
    }
  }, []);

  const handleStartGame = () => {
    alert("게임 시작!");
    gameRoom?.send(Transfer.START_GAME)
  };

  if (!gameRoom) {
    return <div>게임 방에 연결하는 중입니다...</div>;
  }

  return (
    <div className="game-container">
      <div className="player-list">
        <h3>Players</h3>
        <ul>
          {players.map((p) => (
            <li key={p.id}>{p.name}</li>
          ))}
        </ul>
      </div>

      <div className="board">
        <div className="token-area">
          <h4>Tokens</h4>
          <div className="token-grid">
            <div className="token token-diamond">♦</div>
            <div className="token token-sapphire">💎</div>
            <div className="token token-emerald">💚</div>
            <div className="token token-ruby">❤️</div>
            <div className="token token-onyx">⚫</div>
          </div>
        </div>

        <div className="cards-area">
          <div className="card-level level1">Level 1 Cards</div>
          <div className="card-level level2">Level 2 Cards</div>
          <div className="card-level level3">Level 3 Cards</div>
        </div>

        <div className="nobles-area">Noble Cards</div>
      </div>

      <div className="game-controls">
        <button
          disabled={players.length < 2}
          onClick={handleStartGame}
          className={players.length >= 2 ? "btn-start" : "btn-disabled"}
        >
          Game Start
        </button>
      </div>
    </div>
  );
}
