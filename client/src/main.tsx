import {Suspense} from "react"
import {createRoot} from "react-dom/client"
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {DialogProvider, GameRoomProvider, PlayerProvider} from "@/contexts";
import {Game, Lobby} from "@/pages";
import "@/styles/index.css";

createRoot(document.getElementById("root")!).render(
  <DialogProvider>
    <PlayerProvider>
      <GameRoomProvider>
        <Suspense fallback="Loading">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Lobby />} />
              <Route path="/game/:roomId" element={<Game />} />
            </Routes>
          </BrowserRouter>
        </Suspense>
      </GameRoomProvider>
    </PlayerProvider>
  </DialogProvider>
)
