import {useEffect, useState} from "react"
import {CardLevel, CardLocation, GamePhase, Transfer} from "@shared/types";
import {useGameRoom, usePlayer} from "@/contexts";
import type {Player} from "@shared/models/colyseus/Player";
import "./Game.css";

export const Game = () => {
  //
  const { player } = usePlayer();
  const { gameRoom } = useGameRoom();
  const [players, setPlayers] = useState<Player[]>([])
  const [isStart, setIsStart] = useState<boolean>(false);
  const [isMaker, setIsMaker] = useState<boolean>(false);

  const disableStartButton = !isMaker || players.length < 2 || gameRoom?.state?.phase !== GamePhase.WAITING_FOR_PLAYERS;

  useEffect(() => {
    if (!gameRoom || !player) return;

    gameRoom.onMessage(Transfer.METADATA, (metadata: any) => {
      if (metadata.playerId === player.id) {
        setIsMaker(true);
      }
    })
    gameRoom.onMessage(Transfer.ADD_PLAYER, (players: Player[]) => {
      setPlayers(players)
    })

    gameRoom.onMessage(Transfer.START_GAME, (payload: any) => {
      alert(payload.message);
    });

    gameRoom.onStateChange((state) => {
      if (state.phase === GamePhase.GAME_START) {
        setIsStart(true);
      }
    })

    gameRoom.send(Transfer.METADATA)
    gameRoom.send(Transfer.ADD_PLAYER, player);
  }, []);

  const handleStartGame = () => {
    gameRoom?.send(Transfer.START_GAME)
    console.log("start state = ", gameRoom?.state)
  };

  const handleEndTurn = () => {
    gameRoom?.send(Transfer.END_TURN)
    console.log("end turn state = ", gameRoom?.state)
  }

  const cardRenderer = (cardLevel: CardLevel) => {
    if (!gameRoom?.state) return;

    const inBoardCards = gameRoom.state.developmentCards
      .filter(card => card.location === CardLocation.BOARD)
      .filter(card => card.level === cardLevel)

    const emptySlotsCount = 4 - inBoardCards.length;
    const emptySlots = Array.from({ length: emptySlotsCount }, (_, i) => (
      <div key={`empty-${cardLevel}-${i}`} className="empty-card"></div>
    ));

    return (
      <>
        {inBoardCards.map((card) => (
          <div key={card.id} className="card">
            <span className="card-content">{card.name}</span>
          </div>
        ))}
        {emptySlots}
      </>
    );
  };


  const nobleTileRenderer = () => {
    if (!gameRoom?.state) return;

    const nobleTiles = gameRoom.state.nobleTiles;
    const emptySlotsCount = 5 - nobleTiles.length;
    const emptySlots = Array.from({ length: emptySlotsCount }, (_, i) => (
      <div key={`noble-empty-${i}`} className="empty-noble-card"></div>
    ));

    return (
      <>
        {nobleTiles.map(noble => (
          <div className="noble-card" key={noble.id}>
            <span className="card-content"> {noble.name}</span>
          </div>
        ))}
        {emptySlots}
      </>
    )
  }


  const renderPlayerInfo = (player: Player, slotName: string) => {
    return (
      <div className="player-info">
        {player ? (
          <h3>{player.name}</h3>
        ) : (
          <div className="empty-slot">
            <span className="empty-text">{slotName}</span>
          </div>
        )}
      </div>
    );
  };

  if (!gameRoom) {
    return <div>게임 방에 연결하는 중입니다...</div>;
  }

  return (
    <div className="game-container">
      <div className="player-area left-area">
        <div className="top-ui-container button-container">
          <button onClick={handleStartGame} className="start-game-btn" disabled={disableStartButton}>
            게임 시작
          </button>
          <button onClick={handleEndTurn} className="end-turn-btn">
            턴 종료
          </button>
        </div>
        <div className="player-slots">
          {renderPlayerInfo(players[0], 'Player 1')}
          {renderPlayerInfo(players[2], 'Player 3')}
        </div>
      </div>

      <div className="board-area">
        <div className="board">
          <div className="token-area">
            <div className="token-row">
              {["diamond", "sapphire", "emerald", "ruby", "onyx"].map(token => (
                <div key={token} className={`token token-${token}`}></div>
              ))}
            </div>
          </div>

          <div className="nobles-area">
            <div className="noble-row">
              {nobleTileRenderer()}
            </div>
          </div>

          <div className="cards-area">
            {[CardLevel.LEVEL1, CardLevel.LEVEL2, CardLevel.LEVEL3].map(level => (
              <div key={level} className={`card-level level${level}`}>
                <div className="card-stack-back"></div>
                <div className="card-row">
                  {cardRenderer(level)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="player-area right-area">
        <div className="top-ui-container logo-container">
          <h1 className="game-logo">Nyangplendor</h1>
        </div>
        <div className="player-slots">
          {renderPlayerInfo(players[1], 'Player 2')}
          {renderPlayerInfo(players[3], 'Player 4')}
        </div>
      </div>
    </div>
  );
}
